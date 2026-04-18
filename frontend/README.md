# Frontend

## Overview
The frontend is a Vite + React + TypeScript single-page application for the task management system.

It provides:
- login and signup flows
- a project dashboard
- a Kanban board UI for tasks
- cookie-based session handling through the backend

The frontend is designed to keep API access, state management, and UI composition separated so components stay reusable and pages stay readable.

## Main Pages

### Login
- route: `/login`
- signs the user in through the backend
- redirects to the originally requested route when applicable

### Signup
- route: `/signup`
- creates a user account
- redirects authenticated users away from auth pages

### Dashboard
- route: `/`
- shows the authenticated user's projects
- allows project creation

### Kanban Board
- route: `/projects/:projectId`
- fetches board data for a specific project
- supports task creation, editing, deletion, and movement

## Environment Variables
Use [`frontend/.env.example`](.env.example):

```bash
VITE_API_BASE_URL=http://localhost:5000
```

This value is used by the shared Axios client.

## Install and Run
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The Vite dev server runs on `http://localhost:3000`.

## Scripts
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Script Behavior
- `npm run dev`
  - starts the Vite development server
- `npm run build`
  - type-checks and builds the production bundle
- `npm run preview`
  - serves the built output locally
- `npm run lint`
  - runs ESLint

## UI Notes
- built with Reactstrap and Bootstrap
- uses a clean, card-based layout
- includes auth screens, dashboard cards, and board columns
- uses modal-driven task create/edit flows
- includes loading and empty states to avoid blank screens

## Backend Integration Notes
- all API requests use Axios with `withCredentials: true`
- auth state is based on `/api/auth/me`
- no tokens are stored in local storage
- protected pages are guarded in the router layer

## Related Documents
- [`ARCHITECTURE.md`](ARCHITECTURE.md)
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
