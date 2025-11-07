let socket = null;
let audioContext = null;
let isRecording = false;
let captionOverlay = null;

// Create caption overlay
function createCaptionOverlay() {
    if (captionOverlay) return;
    
    captionOverlay = document.createElement('div');
    captionOverlay.id = 'live-caption-overlay';
    captionOverlay.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        font-size: 24px;
        font-weight: 500;
        max-width: 80%;
        text-align: center;
        z-index: 999999;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        font-family: Arial, sans-serif;
        line-height: 1.4;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    captionOverlay.textContent = 'Starting captions...';
    document.body.appendChild(captionOverlay);
}

function removeCaptionOverlay() {
    if (captionOverlay) {
        captionOverlay.remove();
        captionOverlay = null;
    }
}

function updateCaption(text) {
    if (captionOverlay) {
        captionOverlay.textContent = text;
    }
}

async function captureAudio(settings) {
    try {
        // Capture tab audio
        const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: 16000
            },
            video: true
        });
        
        // Stop video track
        stream.getVideoTracks().forEach(track => track.stop());
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 16000
        });
        
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        
        source.connect(processor);
        processor.connect(audioContext.destination);
        
        // Connect to server
        const serverUrl = settings.serverUrl || 'http://localhost:5000';
        socket = io(serverUrl);
        
        socket.on('connect', () => {
            console.log('Connected to caption server');
            updateCaption('Connected. Listening...');
            
            socket.emit('start_stream', {
                source_language: settings.sourceLanguage,
                target_language: settings.targetLanguage
            });
        });
        
        socket.on('caption', (data) => {
            updateCaption(data.text);
        });
        
        socket.on('error', (data) => {
            console.error('Caption error:', data.message);
            updateCaption('Error: ' + data.message);
        });
        
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            updateCaption('Disconnected from server');
        });
        
        processor.onaudioprocess = (e) => {
            if (!isRecording || !socket || !socket.connected) return;
            
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmData = new Int16Array(inputData.length);
            
            for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
            }
            
            const base64Audio = btoa(String.fromCharCode.apply(null, new Uint8Array(pcmData.buffer)));
            
            socket.emit('audio_data', {
                audio: base64Audio,
                source_language: settings.sourceLanguage,
                target_language: settings.targetLanguage,
                simplify: settings.simplifyText
            });
        };
        
        isRecording = true;
        
    } catch (error) {
        console.error('Error capturing audio:', error);
        updateCaption('Error: ' + error.message);
        throw error;
    }
}

function stopCapture() {
    isRecording = false;
    
    if (socket) {
        socket.emit('stop_stream');
        socket.disconnect();
        socket = null;
    }
    
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    
    removeCaptionOverlay();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'start') {
        createCaptionOverlay();
        captureAudio(request.settings)
            .then(() => {
                sendResponse({ success: true });
            })
            .catch((error) => {
                sendResponse({ success: false, error: error.message });
            });
        return true; // Will respond asynchronously
    } else if (request.action === 'stop') {
        stopCapture();
        sendResponse({ success: true });
    }
});

// Inject Socket.IO client library
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.4/socket.io.js';
document.head.appendChild(script);