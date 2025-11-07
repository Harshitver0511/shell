const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const status = document.getElementById('status');
const serverUrl = document.getElementById('serverUrl');
const sourceLanguage = document.getElementById('sourceLanguage');
const targetLanguage = document.getElementById('targetLanguage');
const simplifyText = document.getElementById('simplifyText');

// Load saved settings
chrome.storage.local.get(['serverUrl', 'sourceLanguage', 'targetLanguage', 'simplifyText', 'isActive'], (result) => {
    if (result.serverUrl) serverUrl.value = result.serverUrl;
    if (result.sourceLanguage) sourceLanguage.value = result.sourceLanguage;
    if (result.targetLanguage) targetLanguage.value = result.targetLanguage;
    if (result.simplifyText !== undefined) simplifyText.checked = result.simplifyText;
    
    if (result.isActive) {
        updateUIActive();
    }
});

// Save settings when changed
[serverUrl, sourceLanguage, targetLanguage, simplifyText].forEach(element => {
    element.addEventListener('change', () => {
        chrome.storage.local.set({
            serverUrl: serverUrl.value,
            sourceLanguage: sourceLanguage.value,
            targetLanguage: targetLanguage.value,
            simplifyText: simplifyText.checked
        });
    });
});

startBtn.addEventListener('click', async () => {
    const settings = {
        serverUrl: serverUrl.value,
        sourceLanguage: sourceLanguage.value,
        targetLanguage: targetLanguage.value,
        simplifyText: simplifyText.checked
    };
    
    // Save settings
    chrome.storage.local.set(settings);
    
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
        action: 'start',
        settings: settings
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
            status.textContent = 'Error: ' + chrome.runtime.lastError.message;
            return;
        }
        
        if (response && response.success) {
            chrome.storage.local.set({ isActive: true });
            updateUIActive();
        }
    });
});

stopBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(tab.id, {
        action: 'stop'
    }, () => {
        chrome.storage.local.set({ isActive: false });
        updateUIInactive();
    });
});

function updateUIActive() {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    status.textContent = 'Captions Active';
    status.className = 'status active';
}

function updateUIInactive() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    status.textContent = 'Not Connected';
    status.className = 'status inactive';
}