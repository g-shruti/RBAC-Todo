# Backend

## Overview
The backend is an Express API written in TypeScript. It provides:

- cookie-based authentication
- project and Kanban board APIs
- task creation, update, deletion, and move operations
- centralized validation, logging, and error handling

The backend is designed for a small-scale application but uses production-friendly patterns such as layered architecture, typed validation, and clear separation of concerns.

## Directory Structure
```text
backend/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── logger/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── validators/
├── .env.example
├── package.json
└── tsconfig.json
```

## Key Responsibilities
- `src/app.ts`
  - configures middleware and mounts route groups
- `src/server.ts`
  - connects to MongoDB and starts the HTTP server
- `src/routes/`
  - defines route-level middleware and handler wiring
- `src/services/`
  - contains the main business logic
- `src/repositories/`
  - encapsulates Mongoose query operations

## Environment Variables
Use [`backend/.env.example`](.env.example) as the starting point.

Required values:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`

Common local values:
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
COOKIE_DOMAIN=
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false
```

## Install and Run
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Scripts
```bash
npm run dev
npm run build
npm start
```

### Script Behavior
- `npm run dev`
  - starts the API with `ts-node-dev`
- `npm run build`
  - compiles TypeScript to `dist/`
- `npm start`
  - runs the compiled server from `dist/server.js`

## Main Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `GET /api/projects/:projectId/board`
- `POST /api/projects/:projectId/tasks`
- `PATCH /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId/move`
- `DELETE /api/tasks/:taskId`

Detailed endpoint documentation is available in [`API.md`](API.md).

## Important Implementation Notes
- Auth is cookie-only. The backend does not use Bearer tokens from `Authorization`.
- Success responses use a shared envelope: `{ success, message, data }`.
- Validation is handled with Zod schemas.
- Errors are normalized through a shared error middleware.
- New projects automatically receive the default columns:
  - `To Do`
  - `In Progress`
  - `Done`

## Related Documents
- [`API.md`](API.md)
- [`ARCHITECTURE.md`](ARCHITECTURE.md)
