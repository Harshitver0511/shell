// popup.js - Handles the extension popup UI
let isCapturing = false;
let recentCaptions = [];

const elements = {
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    serverUrl: document.getElementById('serverUrl'),
    sourceLanguage: document.getElementById('sourceLanguage'),
    targetLanguage: document.getElementById('targetLanguage'),
    simplifyText: document.getElementById('simplifyText'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    errorMessage: document.getElementById('errorMessage'),
    captionList: document.getElementById('captionList')
};

// Load saved settings
chrome.storage.local.get(['serverUrl', 'sourceLanguage', 'targetLanguage', 'simplifyText'], (result) => {
    if (result.serverUrl) elements.serverUrl.value = result.serverUrl;
    if (result.sourceLanguage) elements.sourceLanguage.value = result.sourceLanguage;
    if (result.targetLanguage) elements.targetLanguage.value = result.targetLanguage;
    if (result.simplifyText !== undefined) elements.simplifyText.checked = result.simplifyText;
});

// Check if already capturing
chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response && response.isCapturing) {
        updateUIState(true);
        loadRecentCaptions();
    }
});

// Start capturing
elements.startBtn.addEventListener('click', async () => {
    const serverUrl = elements.serverUrl.value.trim();
    if (!serverUrl) {
        showError('Please enter server URL');
        return;
    }

    // Save settings
    chrome.storage.local.set({
        serverUrl: serverUrl,
        sourceLanguage: elements.sourceLanguage.value,
        targetLanguage: elements.targetLanguage.value,
        simplifyText: elements.simplifyText.checked
    });

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
        showError('No active tab found');
        return;
    }

    // Send start message to background
    chrome.runtime.sendMessage({
        action: 'startCapture',
        tabId: tab.id,
        config: {
            serverUrl: serverUrl,
            sourceLanguage: elements.sourceLanguage.value,
            targetLanguage: elements.targetLanguage.value,
            simplify: elements.simplifyText.checked
        }
    }, (response) => {
        if (response.success) {
            updateUIState(true);
            hideError();
        } else {
            showError(response.error || 'Failed to start capture');
        }
    });
});

// Stop capturing
elements.stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopCapture' }, (response) => {
        if (response.success) {
            updateUIState(false);
        }
    });
});

// Listen for caption updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'captionUpdate') {
        addCaption(message.data);
    } else if (message.action === 'connectionStatus') {
        updateConnectionStatus(message.connected);
    } else if (message.action === 'error') {
        showError(message.error);
    }
});

function updateUIState(capturing) {
    isCapturing = capturing;
    if (capturing) {
        elements.startBtn.classList.add('hidden');
        elements.stopBtn.classList.remove('hidden');
        elements.serverUrl.disabled = true;
        elements.sourceLanguage.disabled = true;
        elements.targetLanguage.disabled = true;
        elements.simplifyText.disabled = true;
    } else {
        elements.startBtn.classList.remove('hidden');
        elements.stopBtn.classList.add('hidden');
        elements.serverUrl.disabled = false;
        elements.sourceLanguage.disabled = false;
        elements.targetLanguage.disabled = false;
        elements.simplifyText.disabled = false;
        elements.captionList.innerHTML = '<div class="info-text">Captions will appear here once you start capturing audio</div>';
        recentCaptions = [];
    }
}

function updateConnectionStatus(connected) {
    if (connected) {
        elements.statusDot.classList.add('connected');
        elements.statusText.textContent = 'Connected';
    } else {
        elements.statusDot.classList.remove('connected');
        elements.statusText.textContent = 'Disconnected';
    }
}

function addCaption(caption) {
    // Check if caption already exists (for updates)
    const existingIndex = recentCaptions.findIndex(c => c.id === caption.id);
    
    if (existingIndex >= 0) {
        // Update existing caption
        recentCaptions[existingIndex] = { ...recentCaptions[existingIndex], ...caption };
    } else {
        // Add new caption
        recentCaptions.unshift(caption);
        if (recentCaptions.length > 5) {
            recentCaptions.pop(); // Keep only last 5
        }
    }

    renderCaptions();
}

function renderCaptions() {
    if (recentCaptions.length === 0) {
        elements.captionList.innerHTML = '<div class="info-text">Waiting for captions...</div>';
        return;
    }

    elements.captionList.innerHTML = recentCaptions.map(caption => {
        let content = caption.original || '';
        if (caption.translated) {
            content += `<br><small style="opacity: 0.8">📝 ${caption.translated}</small>`;
        }
        if (caption.simplified) {
            content += `<br><small style="opacity: 0.7">✨ ${caption.simplified}</small>`;
        }
        return `<div class="caption-item">${content}</div>`;
    }).join('');

    // Auto-scroll to top
    elements.captionList.scrollTop = 0;
}

function loadRecentCaptions() {
    chrome.runtime.sendMessage({ action: 'getRecentCaptions' }, (response) => {
        if (response && response.captions) {
            recentCaptions = response.captions;
            renderCaptions();
        }
    });
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.add('show');
    setTimeout(hideError, 5000);
}

function hideError() {
    elements.errorMessage.classList.remove('show');
}