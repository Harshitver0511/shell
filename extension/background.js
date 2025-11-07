// background.js - Handles audio capture coordination with offscreen document
let captureState = {
    isCapturing: false,
    tabId: null,
    config: null,
    recentCaptions: []
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startCapture') {
        startCapture(message.tabId, message.config)
            .then(() => sendResponse({ success: true }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true;
    } 
    else if (message.action === 'stopCapture') {
        stopCapture();
        sendResponse({ success: true });
    }
    else if (message.action === 'getStatus') {
        sendResponse({ isCapturing: captureState.isCapturing });
    }
    else if (message.action === 'getRecentCaptions') {
        sendResponse({ captions: captureState.recentCaptions });
    }
    // Messages from offscreen document
    else if (message.action === 'captionFromOffscreen') {
        addCaption(message.data);
    }
    else if (message.action === 'captionUpdateFromOffscreen') {
        updateCaption(message.data);
    }
    else if (message.action === 'errorFromOffscreen') {
        notifyPopup({ action: 'error', error: message.error });
    }
});

async function startCapture(tabId, config) {
    if (captureState.isCapturing) {
        throw new Error('Already capturing');
    }

    try {
        // Get the tab's audio stream ID
        const streamId = await chrome.tabCapture.getMediaStreamId({
            targetTabId: tabId
        });

        // Create offscreen document if it doesn't exist
        await setupOffscreenDocument();

        // Send audio capture request to offscreen document
        const response = await chrome.runtime.sendMessage({
            action: 'startAudioCapture',
            streamId: streamId,
            config: config
        });

        if (!response.success) {
            throw new Error(response.error || 'Failed to start audio capture');
        }

        captureState = {
            isCapturing: true,
            tabId: tabId,
            config: config,
            recentCaptions: []
        };

        notifyPopup({ action: 'connectionStatus', connected: true });

    } catch (error) {
        console.error('Failed to start capture:', error);
        captureState.isCapturing = false;
        throw error;
    }
}

async function setupOffscreenDocument() {
    // Check if offscreen document already exists
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT']
    });

    if (existingContexts.length > 0) {
        return; // Already exists
    }

    // Create offscreen document
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['USER_MEDIA'],
        justification: 'Capture and process tab audio for real-time captioning'
    });
}

async function stopCapture() {
    if (!captureState.isCapturing) return;

    // Tell offscreen document to stop
    try {
        await chrome.runtime.sendMessage({ action: 'stopAudioCapture' });
    } catch (error) {
        console.error('Error stopping offscreen capture:', error);
    }

    // Close offscreen document
    try {
        await chrome.offscreen.closeDocument();
    } catch (error) {
        // Document might already be closed
        console.log('Offscreen document already closed');
    }

    captureState = {
        isCapturing: false,
        tabId: null,
        config: null,
        recentCaptions: []
    };

    notifyPopup({ action: 'connectionStatus', connected: false });
}

function addCaption(caption) {
    captureState.recentCaptions.unshift(caption);
    if (captureState.recentCaptions.length > 5) {
        captureState.recentCaptions.pop();
    }
    notifyPopup({ action: 'captionUpdate', data: caption });
}

function updateCaption(update) {
    const index = captureState.recentCaptions.findIndex(c => c.id === update.id);
    if (index >= 0) {
        captureState.recentCaptions[index] = {
            ...captureState.recentCaptions[index],
            ...update
        };
        notifyPopup({ action: 'captionUpdate', data: captureState.recentCaptions[index] });
    }
}

function notifyPopup(message) {
    chrome.runtime.sendMessage(message).catch(() => {
        // Popup might be closed, ignore error
    });
}

// Handle extension unload
chrome.runtime.onSuspend.addListener(() => {
    stopCapture();
});