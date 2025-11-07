// offscreen.js - Handles audio capture using AudioWorklet
let audioState = {
    stream: null,
    audioContext: null,
    workletNode: null,
    socket: null,
    sessionId: null
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startAudioCapture') {
        startAudioCapture(message.streamId, message.config)
            .then(() => sendResponse({ success: true }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true;
    } else if (message.action === 'stopAudioCapture') {
        stopAudioCapture();
        sendResponse({ success: true });
    }
});

async function startAudioCapture(streamId, config) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                mandatory: {
                    chromeMediaSource: 'tab',
                    chromeMediaSourceId: streamId
                }
            }
        });

        audioState.stream = stream;

        // Connect to socket
        const socket = io(config.serverUrl, {
            transports: ['websocket', 'polling']
        });

        audioState.socket = socket;

        setupSocketHandlers(socket, config);
        
        // Wait for connection before processing
        socket.on('connect', () => {
            socket.emit('start_stream', {
                source_language: config.sourceLanguage,
                target_language: config.targetLanguage,
                simplify: config.simplify
            });
        });

        socket.on('stream_started', async (data) => {
            audioState.sessionId = data.session_id;
            await processAudioStream(stream, socket, config);
        });

    } catch (error) {
        console.error('Offscreen audio capture failed:', error);
        throw error;
    }
}

function setupSocketHandlers(socket, config) {
    socket.on('caption_result', (data) => {
        chrome.runtime.sendMessage({ 
            action: 'captionFromOffscreen', 
            data: data 
        });
    });

    socket.on('caption_update', (data) => {
        chrome.runtime.sendMessage({ 
            action: 'captionUpdateFromOffscreen', 
            data: data 
        });
    });

    socket.on('error', (data) => {
        chrome.runtime.sendMessage({ 
            action: 'errorFromOffscreen', 
            error: data.message 
        });
    });
}

async function processAudioStream(stream, socket, config) {
    try {
        const audioContext = new AudioContext({ sampleRate: 48000 });
        const source = audioContext.createMediaStreamSource(stream);

        // Load the audio worklet module
        await audioContext.audioWorklet.addModule('audio-processor.js');

        // Create the worklet node
        const workletNode = new AudioWorkletNode(audioContext, 'audio-capture-processor');

        // Handle messages from the worklet
        workletNode.port.onmessage = (event) => {
            if (!audioState.sessionId) return;

            const audioData = event.data.audioData;
            
            // Downsample from 48kHz to 16kHz
            const downsampled = downsampleBuffer(audioData, 48000, 16000);
            
            // Convert to 16-bit PCM
            const pcm = floatTo16BitPCM(downsampled);
            
            // Convert to base64
            const base64Audio = arrayBufferToBase64(pcm);
            
            // Send to server
            socket.emit('audio_chunk', {
                session_id: audioState.sessionId,
                audio: base64Audio
            });
        };

        // Connect the audio graph
        source.connect(workletNode);
        workletNode.connect(audioContext.destination);

        audioState.audioContext = audioContext;
        audioState.workletNode = workletNode;

    } catch (error) {
        console.error('Error setting up audio worklet:', error);
        throw error;
    }
}

function stopAudioCapture() {
    if (audioState.workletNode) {
        audioState.workletNode.disconnect();
        audioState.workletNode = null;
    }
    
    if (audioState.audioContext) {
        audioState.audioContext.close();
        audioState.audioContext = null;
    }
    
    if (audioState.stream) {
        audioState.stream.getTracks().forEach(track => track.stop());
        audioState.stream = null;
    }
    
    if (audioState.socket && audioState.sessionId) {
        audioState.socket.emit('stop_stream', { 
            session_id: audioState.sessionId 
        });
        audioState.socket.disconnect();
        audioState.socket = null;
    }

    audioState.sessionId = null;
}

// Audio processing utilities
function downsampleBuffer(buffer, inputSampleRate, outputSampleRate) {
    if (inputSampleRate === outputSampleRate) return buffer;
    
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    
    for (let i = 0; i < newLength; i++) {
        const start = Math.floor(i * sampleRateRatio);
        const end = Math.ceil((i + 1) * sampleRateRatio);
        let sum = 0;
        let count = 0;
        
        for (let j = start; j < end && j < buffer.length; j++) {
            sum += buffer[j];
            count++;
        }
        
        result[i] = count > 0 ? sum / count : 0;
    }
    
    return result;
}

function floatTo16BitPCM(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    
    for (let i = 0; i < float32Array.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        const val = s < 0 ? s * 0x8000 : s * 0x7FFF;
        view.setInt16(i * 2, val, true);
    }
    
    return buffer;
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}