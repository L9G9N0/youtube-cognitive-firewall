# YouTube Cognitive Firewall

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-blue.svg)](https://vite.dev/)
[![Manifest V3](https://img.shields.io/badge/Chrome-Manifest_V3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/)

A production-grade, open-source Google Chrome Extension designed to shield users from addictive loop feedback mechanisms, clickbait, and cognitive distractions on YouTube. It acts as a client-side firewall, enabling users to block attention-hijacking UI elements, filter clickbait titles, and manage custom attention limit quotas.

---

## Table of Contents

- [1. Overview & Vision](#1-overview--vision)
- [2. System Architecture](#2-system-architecture)
- [3. Codebase Directory Structure](#3-codebase-directory-structure)
- [4. Technology Stack](#4-technology-stack)
- [5. Core Components](#5-core-components)
- [6. Data Flow & Communication](#6-data-flow--communication)
- [7. Installation & Setup](#7-installation--setup)
- [8. Usage Guide](#8-usage-guide)
- [9. Configuration Schema](#9-configuration-schema)
- [10. Security & Threat Model](#10-security--threat-model)
- [11. Performance Optimizations](#11-performance-optimizations)
- [12. Error Handling & Resilience](#12-error-handling--resilience)
- [13. Testing](#13-testing)
- [14. Roadmap](#14-roadmap)
- [15. Contributing](#15-contributing)
- [16. Maintainers & Support](#16-maintainers--support)
- [17. License](#17-license)

---

## 1. Overview & Vision

### 1.1 Problem Statement
Modern video streaming networks (like YouTube) are engineered to maximize user engagement and session time. Through infinite recommendations, autoplays, notifications, and clickbait hooks, users are guided into addictive loops that drain productivity and impact cognitive focus. 

### 1.2 Solution
The **YouTube Cognitive Firewall** implements a strict client-side interceptor that neutralizes distracting UX triggers directly in the browser DOM. By putting the user back in control of their dashboard, the extension transforms YouTube from an attention-capture system into a focused learning utility.

---

## 2. System Architecture

```
   ┌─────────────────────────────────────────────────────────────┐
   │                       Google Chrome                         │
   │                                                             │
   │   ┌───────────────┐                  ┌──────────────────┐   │
   │   │  Popup UI     │                  │ Content Script   │   │
   │   │  (React App)  │                  │ (DOM Observer)   │   │
   │   └───────┬───────┘                  └────────┬─────────┘   │
   │           │ (Query / Save State)              │ (Query Rules)
   │           ▼                                   ▼             │
   │   ┌─────────────────────────────────────────────────────┐   │
   │   │             Background Service Worker               │   │
   │   │             (State Coordinator & Rules Engine)      │   │
   │   └───────────────────────┬─────────────────────────────┘   │
   │                           │                                 │
   └───────────────────────────┼─────────────────────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ chrome.storage.sync │
                    │ (Persistent State)  │
                    └─────────────────────┘
```

---

## 3. Codebase Directory Structure

Detailed codebase folders are layed out below:

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
├── eslint.config.js                 # Linter configuration (Flat config)
├── package.json                     # NPM packages registry and build tasks
├── tsconfig.json                    # Compiler config variables
├── vite.config.ts                   # Rollup configurations for popup, content, bg
└── README.md                        # Master repository guide
```

---

## 4. Technology Stack

- **Core Framework**: React 19 (Popup interface rendering).
- **Language**: TypeScript (Strong compile-time type-safety across extension scripts).
- **Bundle Compiler**: Vite 8 & Rollup (Custom build inputs to generate separate popup, content, and background files).
- **Extension API**: Manifest V3 (Google Chrome extension standard).

---

## 5. Core Components

### 5.1 Extension Popup UI
A React dashboard where users configure firewall options. Settings are divided into categories:
- **Distraction Shields**: Comments, recommendations sidebar, home feed, auto-plays.
- **Clickbait Filters**: Title keywords blacklist, thumbnail image blur.
- **Attention Limits**: Session duration counters and timers.

### 5.2 Background Service Worker
Serves as the persistent coordinator. It:
- Synchronizes configuration settings across user devices using `chrome.storage.sync`.
- Tracks active session lengths and fires background timers.
- Listens to lifecycle changes and coordinates rule updates with content scripts.

### 5.3 Content Injection Script
Directly executes inside YouTube tabs. It:
- Evaluates active rules against the active page DOM.
- Runs a fast, light `MutationObserver` to intercept and remove distracting elements before they render.
- Blurs or replaces clickbait thumbnails and elements.

---

## 6. Data Flow & Communication

The components communicate using message passing contracts (`chrome.runtime` APIs):

```
[Popup React App] ──(State Change Notification)──> [Background Worker]
                                                          │
                                                (Write updates to sync)
                                                          │
                                                          ▼
                                                [chrome.storage.sync]
                                                          ▲
                                                          │
                                                (Rules updated event)
                                                          │
[Content Script] ◄──(Read Active State Rules)─────────────┘
```

---

## 7. Installation & Setup

### 7.1 Prerequisites
- Node.js (v18.0.0 or higher)
- Google Chrome Browser

### 7.2 Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/L9G9N0/youtube-cognitive-firewall.git
   cd youtube-cognitive-firewall
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Run the development build watcher:
   ```bash
   npm run build -- --watch
   ```
4. Load the unpacked build into Google Chrome:
   - Navigate to `chrome://extensions/` in your Chrome browser.
   - Enable **Developer Mode** in the top-right corner.
   - Click **Load unpacked** in the top-left corner.
   - Choose the compiled `dist/` directory generated in your project folder.

---

## 8. Usage Guide

- **Shield Configuration**: Open the extension popup in your browser toolbar to toggle filters.
- **Clickbait Blacklist**: Enter comma-separated keywords into the custom input box. Any YouTube video containing these keywords in the title will be automatically hidden.
- **Attention Quota**: Set a daily time limit (e.g. 30 minutes). Once reached, the firewall blocks further video viewing, displaying a focus warning.

---

## 9. Configuration Schema

Configured parameters are stored in `chrome.storage.sync` matching this TypeScript structure:

```typescript
export interface FirewallSettings {
  shields: {
    hideComments: boolean;
    hideRecommendations: boolean;
    hideHomeFeed: boolean;
    disableAutoplay: boolean;
  };
  clickbait: {
    enabled: boolean;
    blurThumbnails: boolean;
    titleBlacklist: string[]; // Lowercase keywords
  };
  quota: {
    enabled: boolean;
    maxDailyMinutes: number;
    currentSecondsUsed: number;
    lastResetTimestamp: number; // UTC timestamp
  };
}
```

---

## 10. Security & Threat Model

### 10.1 Content Security Policy (CSP)
We enforce a strict Manifest V3 CSP configuration. Inline script execution is blocked, and external scripting resources are prohibited. All code must be bundled locally inside the extension archive.

### 10.2 DOM Injection Sanitization
To prevent DOM-based XSS when filtering titles or adding placeholder notifications, the content script uses only safe DOM mutation methods (`textContent`, `classList`) instead of directly parsing raw markup strings via `innerHTML`.

### 10.3 Message Origin Verification
The background script validates the origin and structure of incoming runtime messages. Arbitrary actions sent from unverified client tabs are discarded.

---

## 11. Performance Optimizations

- **Debounced DOM Mutation Checks**: YouTube is a heavy Single Page Application (SPA). To prevent browser lag, the content script's `MutationObserver` runs with high-performance query selections, processing changes in batches.
- **Vite Rollup Chunk Optimization**: The build configuration uses Rollup chunk overrides to guarantee that the content script is bundled as a single file, eliminating performance bottlenecks in module loading.
- **Lightweight Storage Sync**: Reads and writes to `chrome.storage.sync` are batched to respect API rate limits.

---

## 12. Error Handling & Resilience

- **Storage Failures**: If `chrome.storage.sync` fails or is unavailable, the extension automatically degrades to an in-memory session cache.
- **Observer Reconnection**: If YouTube's client framework destroys custom DOM structures or detaches observers, the content script executes a re-connection watcher to re-attach rules.
- **Graceful Daily Reset**: If the system clock fails or fails to query internet timezone services, session limits reset based on local timestamp differences.

---

## 13. Testing

Run lint checking and typescript validations:
```bash
# Run ESLint check
npm run lint

# Validate TypeScript compilation
npx tsc --noEmit
```

---

## 14. Roadmap

- **Phase 1: Foundation (Current)**: Setting up build tools, directory structures, and configurations.
- **Phase 2: Distraction Shields**: Content script observer to intercept sidebar recommendations and comment loops.
- **Phase 3: Clickbait Filters**: Thumbnail blurring and keyword title blockers.
- **Phase 4: Time Management**: Quotas tracker and background limit notification workers.
- **Phase 5: Performance Polish**: Optimization of observers, CPU checks, and memory leak clean-up.

---

## 15. Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) to review development setup steps, branch guidelines, and pull request procedures before submitting improvements.

---

## 16. Maintainers & Support

- **Maintainer**: L9G9N0
- **Security Contact**: hackerdc8287@gmail.com
- **Support Channels**: For bugs and support, please open a GitHub Issue in the repository.

---

## 17. License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.
