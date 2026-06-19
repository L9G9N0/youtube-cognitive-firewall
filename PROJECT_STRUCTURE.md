# Project Structure Guide

This guide explains the directory layout of the YouTube Cognitive Firewall repository.

---

## 1. Directory Tree Overview

```
youtube-cognitive-firewall/
├── .github/                         # GitHub repository configuration
│   ├── ISSUE_TEMPLATE/              # Issue reporting markdown templates
│   └── PULL_REQUEST_TEMPLATE.md     # Pull Request checklists
├── public/                          # Static assets for the extension packaging
│   ├── favicon.svg                  # Popup app favicon
│   ├── icons.svg                    # SVG icons sprite sheet
│   └── manifest.json                # Extension Manifest V3 configuration
├── src/                             # TypeScript source code
│   ├── assets/                      # Graphic assets
│   ├── background/                  # Service Worker directory
│   │   └── index.ts                 # Service worker entrypoint (State sync)
│   ├── content/                     # Content injection directory
│   │   └── index.ts                 # DOM observer and filter logic
│   ├── App.css                      # Popup UI styles
│   ├── App.tsx                      # Main Popup react app component
│   ├── index.css                    # Base global CSS resets
│   ├── main.tsx                     # Renders popup into popup DOM #root
│   └── vite-env.d.ts                # Vite environment typings
```

---

## 2. Directory Breakdown

### 2.1 Public Directory (`/public`)
Static assets copied directly to the root of the `/dist` directory during compilation:
- **`manifest.json`**: The Chrome Extension Manifest V3 configuration. Declares script inject parameters, permissions (`storage`), and popup paths.
- **`icons.svg`**: Sprite sheet containing SVG icons.

### 2.2 Source Directory (`/src`)
- **`/background`**: The service worker, running in a background process to track timers and coordinate states.
- **`/content`**: Content scripts injected directly into matching YouTube tabs to modify the DOM.
- **`/assets`**: Logos, images, and branding graphics.
- **`App.tsx` & `main.tsx`**: React application files for the popup interface.
