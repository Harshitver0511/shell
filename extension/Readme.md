# Chrome Extension - Live Multilingual Captions

## Installation

1. **Start the Flask server first:**
   ```bash
   python app.py
   ```

2. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `extension` folder

3. **Add icons (optional):**
   - Create icon files: `icon16.png`, `icon48.png`, `icon128.png`
   - Place them in the `extension` folder
   - Or the extension will work without icons

## Usage

### For Google Meet / Zoom:

1. Open Google Meet or Zoom meeting
2. Click the extension icon in Chrome toolbar
3. Configure:
   - Source Language (what's being spoken)
   - Caption Language (what you want to see)
   - Enable/disable simplification
4. Click "Start Captions"
5. In the screen share dialog, make sure to check "Share audio"
6. Captions will appear at the bottom of the page

### For YouTube:

1. Open any YouTube video
2. Click the extension icon
3. Configure languages
4. Click "Start Captions"
5. Share the tab audio
6. Play the video - captions will appear

## Features

✅ Works on Google Meet, Zoom, YouTube, and any webpage  
✅ Overlays captions directly on the page  
✅ No need to switch tabs  
✅ Captures system audio from meetings  
✅ Real-time translation and simplification  
✅ Saves your language preferences  

## Troubleshooting

**Extension not appearing:**
- Make sure Developer mode is enabled in `chrome://extensions/`
- Check that you loaded the `extension` folder, not individual files

**No captions appearing:**
- Ensure Flask server is running on localhost:5000
- Check that you selected "Share audio" when starting captions
- Verify the source language matches what's being spoken

**"Error: Could not establish connection":**
- The Flask backend server is not running
- Start the server with `python app.py`

**Captions stop after tab switch:**
- This is normal - restart captions after switching tabs
- The extension maintains audio capture per tab

## Permissions Explained

- `activeTab`: Access current tab to inject caption overlay
- `tabCapture`: Capture audio from the tab
- `storage`: Save your language preferences
- `host_permissions`: Access Meet, Zoom, YouTube to inject captions

## Privacy

- All audio processing happens on your local Flask server
- No audio is stored or transmitted except to your Google Cloud API
- The extension doesn't collect any personal data
- Audio capture stops when you click "Stop Captions"