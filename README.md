# ⚠️ Questionnaire Builder (Deprecated)
> Status: Deprecated — will be sunset after Oct 2026

---

## 📝 Overview

**Questionnaire Builder** is a FHIR-compatible system for building and rendering dynamic forms.

This project previously provided tooling for:
- Visual form creation
- Questionnaire rendering
- Core state and logic management

---

## 📦 Packages (Deprecated)

- **[@mieweb/forms-editor](./packages/forms-editor)** — Visual form builder  
- **[@mieweb/forms-renderer](./packages/forms-renderer)** — Display and submit forms  
- **[@mieweb/forms-engine](./packages/forms-engine)** — Core state management  

All packages in this repository are now **deprecated**.

---

## 🚨 Deprecation & Sunset Timeline

This project is entering a **6-month maintenance window** starting from the date of deprecation.

### During this period

- 🛠️ Critical bug fixes may still be addressed  
- ⚠️ No new features will be added  
- 📉 Limited support and maintenance  

### After 6 months

- ❌ No further updates or support  
- 🪦 Repository will be considered fully sunset  
- 🚫 Not safe for production reliance  

---

## 🔄 Migration Path (Recommended)

This project has been **replaced by a new system**:

👉 https://github.com/mieweb/eSheet

You should begin migrating to the new platform as soon as possible.

### Why migrate?

- Active development and support  
- Improved architecture and scalability  
- Better long-term compatibility and maintainability  

---

## 🔄 For Existing Users

If you are currently using this project:

- Your existing applications will continue to function during the support window
- You should begin planning migration immediately
- Avoid adding new dependencies or features on top of this system

---

## 📖 Documentation (Legacy)

Legacy documentation is still available for reference:

👉 https://forms-doc.os.mieweb.org/

Use this for:
- Maintaining existing integrations
- Reviewing legacy APIs
- Understanding previous architecture

---

## 🛠️ Development (Legacy Only)

This repository is preserved for maintenance during the deprecation window.

```bash
git clone https://github.com/mieweb/questionnaire-builder.git
cd questionnaire-builder
npm install
```

### Scripts

```bash
# Build
npm run build
npm run build:packages
npm run build:docs

# Development
npm run dev
npm run dev:demo

# Publishing (not recommended)
npm run publish

# Lint
npm run lint
```

---

## 🤝 Contributing

We are no longer accepting contributions for new features.

Only critical fixes may be considered during the support window.

For reference:

- [Contributing Guide](./.github/CONTRIBUTING.md)  
- https://forms-doc.os.mieweb.org/docs/contributing  

---

## 📌 Important Notes

- This repository is maintained for **temporary legacy support only**
- APIs and behavior may not align with future platform direction
- Continued use beyond the support window is at your own risk

---

## 🔮 Future Direction

All future development is moving to:

👉 https://github.com/mieweb/eSheet

---

## 📄 License

MIT
