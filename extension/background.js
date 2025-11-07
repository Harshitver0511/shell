// Background script for the extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Live Multilingual Captions extension installed');
    
    // Set default values
    chrome.storage.local.set({
        serverUrl: 'http://localhost:5000',
        sourceLanguage: 'english',
        targetLanguage: 'english',
        simplifyText: true,
        isActive: false
    });
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Open popup
    chrome.action.openPopup();
});

// Listen for tab updates to maintain caption state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.storage.local.get(['isActive'], (result) => {
            if (result.isActive) {
                // Captions were active, might need to restart
                console.log('Tab updated, captions may need restart');
            }
        });
    }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateIcon') {
        if (request.active) {
            chrome.action.setBadgeText({ text: 'ON', tabId: sender.tab.id });
            chrome.action.setBadgeBackgroundColor({ color: '#4CAF50', tabId: sender.tab.id });
        } else {
            chrome.action.setBadgeText({ text: '', tabId: sender.tab.id });
        }
    }
    sendResponse({ received: true });
});