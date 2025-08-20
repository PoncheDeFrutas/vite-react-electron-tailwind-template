# Vite + React + Tailwind + Electron Template

A starter kit for cross‑platform desktop applications using **Vite**, **React**, **TypeScript**, **Tailwind CSS**, and **Electron**. Use it as a foundation for new projects and tailor it to your needs.

---

## Features
- Fast Vite 7 dev server with hot module replacement
- React 19 + TypeScript
- Tailwind CSS 4 via `@tailwindcss/vite`
- Electron 37 main process with preload isolation
- Electron Builder packaging configuration included

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- `npm` or `pnpm`

### Install Dependencies
```bash
npm install        # or pnpm install
```

### Development Workflows
| Goal                             | Command |
|----------------------------------|--------|
| Start only Vite dev server       | `npm run dev` |
| Start Vite + Electron (hot‑reload) | `npm run electron:dev` |
| Launch Electron after manual `npm run dev` | `npm run electron` |

Scripts are defined in `package.json` and run Vite plus Electron with the necessary environment variables for development.

---

## Building & Packaging

| Task                               | Command |
|------------------------------------|--------|
| Build renderer assets only         | `npm run build` |
| Build for Electron & package app   | `npm run app:build` |

Packaging uses Electron Builder with settings in the `build` section of `package.json`.

---

## Customization Guide

- **Window Size & Appearance**  
  Update `width`, `height`, `minWidth`, `minHeight`, or `backgroundColor` in `electron/electron.cjs` inside the `createWindow` function to modify the default Electron window.

- **Preload & IPC**  
  Expose additional APIs to the renderer in `electron/preload.cjs` via `contextBridge` and `ipcRenderer`.

- **Dev Server Port & Base Path**  
  Change the Vite server port or base path in `vite.config.ts` to fit your environment.

- **App Metadata & Installer Options**  
  Edit `appId`, `productName`, NSIS settings, and other packaging details in the `build` section of `package.json`.

---

## Project Structure
```
electron/        Electron main & preload scripts
src/             React renderer code (App.tsx, main.tsx, styles)
public/          Static assets
vite.config.ts   Vite + Tailwind configuration
package.json     Scripts, deps, Electron Builder config
```

---

## Additional Commands
- `npm run lint` – run ESLint on all sources

---

## License
Distributed under the MIT License. See the `LICENSE` file for details.

