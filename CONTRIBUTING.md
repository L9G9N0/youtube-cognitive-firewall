# Contributing to YouTube Cognitive Firewall

Thank you for choosing to contribute to the YouTube Cognitive Firewall! We welcome pull requests for bug fixes, performance improvements, security mitigations, and feature enhancements.

---

## 1. Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the maintainers.

---

## 2. Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- Git

### Installation
1. Fork the repository on GitHub and clone it locally:
   ```bash
   git clone https://github.com/your-username/youtube-cognitive-firewall.git
   cd youtube-cognitive-firewall
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Run the compiler watcher:
   ```bash
   npm run build -- --watch
   ```
4. Load the unpacked build in Chrome:
   - Open `chrome://extensions/`.
   - Enable **Developer Mode**.
   - Click **Load unpacked** and select the compiled `dist/` directory.

---

## 3. Style Guidelines

### TypeScript & React
- Follow clean coding practices and keep React components modular.
- Use explicit TypeScript interfaces for all state models and event message payloads.
- Write explanatory comments for complex DOM structures or observer queries.

### Git Commits
- Use semantic prefix tags for commit messages:
  - `feat`: A new feature update.
  - `fix`: A bug fix.
  - `docs`: Documentation updates.
  - `style`: Visual styling or CSS changes.
  - `refactor`: Structural codebase improvements without changing features.
  - `test`: Adding or running tests.
  - `chore`: Internal repository updates (e.g. package upgrades, configs).

---

## 4. Submitting Pull Requests

1. Create a descriptive branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Implement your changes, verifying that your build compiles successfully.
3. Validate your code formatting using the linter:
   ```bash
   npm run lint
   ```
4. Commit your files with a semantic message:
   ```bash
   git commit -m "feat: implement comments blocking observer"
   ```
5. Push to your fork and submit a Pull Request to the upstream `main` branch.
