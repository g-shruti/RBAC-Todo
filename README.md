# Task Management System

## Overview

This repository contains a small-scale task management system with:

- a `backend/` Node.js + Express API written in TypeScript
- a `frontend/` React + Vite application written in TypeScript
- cookie-based authentication using JWT stored in an HTTP-only cookie
- a Kanban-style project board with task creation, editing, deletion, and move support

The codebase is structured for maintainability first: the backend uses a layered architecture, and the frontend separates pages, components, hooks, services, and API access.

## Features

- User signup, login, and authenticated session lookup via `/api/auth/me`
- HTTP-only cookie authentication with `withCredentials: true`
- Project dashboard with project creation
- Kanban board with default columns: `To Do`, `In Progress`, and `Done`
- Task creation, update, deletion, and move persistence
- Centralized validation, error handling, logging, and API abstractions
- Extensibility hooks for future RBAC and project membership models

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Zod
- bcrypt
- jsonwebtoken
- cookie-parser
- helmet
- express-rate-limit

### Frontend

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- TanStack Query
- Reactstrap + Bootstrap
- `@dnd-kit/core` and `@dnd-kit/sortable`
- `clsx`

## High-Level Architecture

```text
Browser (React + Vite)
    |
    |  HTTP(S) + cookies
    v
Express API (routes -> controllers -> services -> repositories)
    |
    v
MongoDB
```

## Repository Structure

```text
.
├── backend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── ARCHITECTURE.md
├── DEPLOYMENT.md
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 20+
- npm
- MongoDB running locally or a reachable MongoDB URI

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` as needed:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- cookie settings for your environment

Start the backend:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Start the frontend:

```bash
npm run dev
```

The frontend Vite dev server is configured for `http://localhost:3000`.

## How To Run Locally

Run the backend and frontend in separate terminals:

```bash
# Terminal 1
cd backend
npm run dev
```

```bash
# Terminal 2
cd frontend
npm run dev
```

Then open:

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:5000/health`

## Important Development Notes

- The frontend expects cookie-based auth and always sends requests with credentials.
- The backend CORS origin must match the frontend origin. By default:
  - frontend dev server: `http://localhost:3000`
  - backend `CLIENT_ORIGIN`: `http://localhost:3000`
- There is no logout endpoint yet.
- RBAC is not implemented yet, but the current structure is ready for future `ProjectUser` and role-based access additions.

## Additional Documentation

- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`DEPLOYMENT.md`](DEPLOYMENT.md)
- [`backend/README.md`](backend/README.md)
- [`backend/API.md`](backend/API.md)
- [`backend/ARCHITECTURE.md`](backend/ARCHITECTURE.md)
- [`frontend/README.md`](frontend/README.md)
- [`frontend/ARCHITECTURE.md`](frontend/ARCHITECTURE.md)
