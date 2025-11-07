// audio-processor.js - AudioWorklet processor for audio capture
class AudioCaptureProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.bufferSize = 4096;
        this.buffer = new Float32Array(this.bufferSize);
        this.bufferIndex = 0;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        
        if (input.length > 0) {
            const inputChannel = input[0];
            
            // Accumulate audio data
            for (let i = 0; i < inputChannel.length; i++) {
                this.buffer[this.bufferIndex++] = inputChannel[i];
                
                // When buffer is full, send it to main thread
                if (this.bufferIndex >= this.bufferSize) {
                    // Send the buffer data
                    this.port.postMessage({
                        audioData: this.buffer.slice(0, this.bufferIndex)
                    });
                    
                    this.bufferIndex = 0;
                }
            }
        }
        
        // Keep the processor alive
        return true;
    }
}

registerProcessor('audio-capture-processor', AudioCaptureProcessor);