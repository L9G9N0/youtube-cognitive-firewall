# Development Guide

This guide details the local setup, build configuration, and development workflow for contributing to this project.

---

## 1. Setup Checklist

### Tools Required
- **Node.js** (v18.0.0 or higher)
- **NPM** (v9.0.0 or higher)

### Setup Steps
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/L9G9N0/youtube-cognitive-firewall.git
   cd youtube-cognitive-firewall
   npm install
   ```
2. Build the extension:
   ```bash
   # Run compile once
   npm run build
   
   # Or run build watcher for real-time development updates
   npm run build -- --watch
   ```
3. Load the extension in Chrome:
   - Open `chrome://extensions/`.
   - Toggle **Developer Mode** on.
   - Click **Load unpacked** and select the `/dist` directory.

---

## 2. Chrome Extension Debugging

- **Popup UI**: Right-click the extension icon in your Chrome toolbar and select **Inspect** to open Chrome DevTools for the React dashboard.
- **Content Scripts**: Open Chrome DevTools directly inside any YouTube tab. Code outputs (e.g. `console.log`) will display in the console.
- **Background Service Worker**: Open `chrome://extensions/` and click the **service worker** link next to the YouTube Cognitive Firewall card to open DevTools for the background script.
