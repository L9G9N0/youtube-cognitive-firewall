# Product Roadmap

This document outlines the milestones and roadmap plans for the YouTube Cognitive Firewall development.

---

## 📅 Roadmap Overview

```
Phase 1: Foundation ──> Phase 2: Shields ──> Phase 3: Clickbait ──> Phase 4: Quota ──> Phase 5: AI Insights
    (Active)             (Target)           (Target)            (Target)           (Future)
```

---

## 🗺️ Execution Milestones

### Milestone 1: Extension Foundation (Current)
- [x] Configure Manifest V3 shell and project build configurations (Vite + TypeScript).
- [x] Setup repository standards (Issue templates, license, contribution pipelines).
- [x] Refactor ES6 build outputs.

### Milestone 2: Distraction Shields (Target)
- [ ] Implement DOM observer script (`src/content/index.ts`) targeting Comments, Sidebar Recommendations, Home Feed, and Autoplays.
- [ ] Connect Popup UI switches to storage variables.

### Milestone 3: Clickbait Filters (Target)
- [ ] Build thumbnail blur logic based on CSS filters.
- [ ] Create keyword blacklist matching algorithm to hide video nodes before they render.

### Milestone 4: Time Management & Quotas (Target)
- [ ] Set up background timers tracking active tabs.
- [ ] Implement quota alert screens.

### Milestone 5: AI Insights (Future)
- [ ] Integrate lightweight on-device Gemini models (Gemini Nano) or secure remote APIs to summarize videos or scan for clickbait patterns.
