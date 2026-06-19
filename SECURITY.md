# Security Policy

## Supported Versions

Only the latest release of the YouTube Cognitive Firewall is supported.

| Version | Supported |
| :--- | :--- |
| v0.1.x | Yes |
| < v0.1.0 | No |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please do not open a public GitHub issue. Instead, report it through the following process:

1. Send an email describing the details to **security-report@example.com**.
2. Include description details of the vulnerability, step-by-step instructions to reproduce it, and potential mitigations.
3. We will acknowledge your report within 48 hours and work with you to resolve the vulnerability securely.
4. Once fixed, we will publish a security patch release and credit your contribution.

---

## Implemented Defenses

Our extension architecture implements the following security protocols:
- **Manifest CSP**: Content-Security-Policy rules in Manifest V3 to block inline scripts and remote script executions.
- **DOM Sanitization**: Content script uses safe DOM mutation methods (`textContent`, `classList`) instead of parsing raw markup strings via `innerHTML` to prevent stored Cross-Site Scripting (XSS) when blocking clickbait video titles.
- **Sender Verification**: The background service worker validates the origin and structure of incoming runtime messages, rejecting requests sent from unverified client tabs.
