# Architecture & System Design

This document details the architectural specifications and message coordinator patterns of the YouTube Cognitive Firewall Chrome Extension.

---

## 1. Technical Layout

The extension is divided into three execution contexts that share status indicators using Google Chrome's Manifest V3 extension APIs.

```
+-------------------------------------------------------------+
|                        Google Chrome                        |
|                                                             |
|   +---------------+                  +------------------+   |
|   |   Popup UI    |                  |  Content Script  |   |
|   |  (React/Vite) |                  |  (DOM Observer)  |   |
|   +-------+-------+                  +--------+---------+   |
|           | (Query / Save State)              | (Query Rules)
|           v                                   v             |
|   +-----------------------------------------------------+   |
|   |              Background Service Worker              |   |
|   |               (Coordinator & Timer)                 |   |
|   +-----------------------+-----------------------------+   |
|                           |                                 |
+---------------------------+---------------------------------+
                            |
                            v
                  +-------------------+
                  | chrome.storage.sync|
                  | (Persistent State)|
                  +-------------------+
```

---

## 2. Execution Contexts

### 2.1 Extension Popup UI (React App)
- Renders the user-facing settings panel.
- Binds controls to `chrome.storage.sync` to update settings in real-time.
- Entrypoint: `index.html` (which loads `src/main.tsx` and renders `src/App.tsx`).

### 2.2 Background Service Worker
- Active in the background, responding to extension lifecycle triggers and messaging events.
- Tracks active YouTube session durations, triggering warnings when limits are exceeded.
- Location: `src/background/index.ts`.

### 2.3 Content Injection Script
- Injected directly into tabs matching `https://*.youtube.com/*`.
- Sets up a high-performance `MutationObserver` to intercept DOM mutations and remove target elements (e.g. comments, recommendations sidebars).
- Location: `src/content/index.ts`.

---

## 3. Communication Patterns (Message Handlers)

The popup and content scripts communicate with the background coordinator using message passing:

- **State Queries**: Content scripts request active rule lists at page load.
- **Quota Updates**: Background workers send warnings to content scripts when daily timers expire.
- **Reset Signals**: Popup controls notify the background worker to reset timers.
