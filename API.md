# API & Message Protocols

This document defines the message payloads and schemas used for communication between the extension contexts.

---

## 1. Extension Messages Schema

All runtime messages sent via `chrome.runtime.sendMessage` adhere to the following TypeScript interfaces.

### 1.1 Query State request
Sent by the content script to the background worker to fetch active configurations.
- **Direction**: `Content Script` ──> `Background Worker`
- **Schema**:
  ```typescript
  interface QueryStateRequest {
    action: "QUERY_STATE";
  }
  ```
- **Response**:
  ```typescript
  interface QueryStateResponse {
    status: "success";
    settings: FirewallSettings; // Ref settings schema in README
  }
  ```

### 1.2 Quota Warning
Sent by the background worker to content scripts when the user's focus quota expires.
- **Direction**: `Background Worker` ──> `Content Script`
- **Schema**:
  ```typescript
  interface QuotaWarningMessage {
    action: "QUOTA_EXPIRED";
    minutesLimit: number;
  }
  ```

### 1.3 Timer Reset Request
Sent by the popup to the background worker to manually reset daily session limits.
- **Direction**: `Popup UI` ──> `Background Worker`
- **Schema**:
  ```typescript
  interface ResetTimerRequest {
    action: "RESET_TIMER";
  }
  ```
