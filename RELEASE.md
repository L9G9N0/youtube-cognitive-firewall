# Release Guide

This guide details the release pipeline and checklists for publishing production builds to the Chrome Web Store.

---

## 1. Release Checklist

1. **Version Update**: Update the `"version"` field in `package.json` to reflect Semantic Versioning requirements (e.g. `v0.1.0`).
2. **Manifest Verification**: Ensure the `"version"` field in `public/manifest.json` matches `package.json` exactly.
3. **Lint Check**: Run the linter to verify code formatting:
   ```bash
   npm run lint
   ```
4. **Compile Production Bundle**:
   Build the production-ready assets:
   ```bash
   npm run build
   ```
5. **Pack Extension**: Zip the `/dist` directory. The resulting zip file is ready for upload to the Chrome Developer Dashboard.

---

## 2. Publish to Chrome Web Store

1. Log in to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Select the YouTube Cognitive Firewall application.
3. Upload the compiled ZIP file.
4. Update the store listing details (store screenshots, descriptions, privacy policy URLs).
5. Submit for review.
