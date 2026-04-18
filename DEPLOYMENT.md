# Deployment Guide

## Overview
This project is deployed as two separate artifacts:

- a backend Node.js service built from TypeScript in [`backend/`](backend/)
- a frontend static site built by Vite in [`frontend/`](frontend/)

Deploy them independently and wire them together with:

- the frontend build-time API URL
- the backend CORS configuration
- production-safe cookie settings

## Backend Deployment

### Required Environment Variables
Set these in the backend runtime environment:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=<your-frontend-origin>
COOKIE_DOMAIN=<optional-cookie-domain>
COOKIE_SAME_SITE=none
COOKIE_SECURE=true
```

Notes:
- `CLIENT_ORIGIN` must be the exact frontend origin allowed by CORS.
- `COOKIE_SAME_SITE=none` is usually required when frontend and backend are on different origins.
- `COOKIE_SECURE=true` is required for secure cross-site cookies in production.

### Build Steps
```bash
cd backend
npm install
npm run build
```

This produces compiled JavaScript in `backend/dist/`.

### Start Command
```bash
cd backend
npm start
```

`npm start` runs:
```bash
node dist/server.js
```

### Process Management With PM2
PM2 is a reasonable production choice for EC2 or a similar VM:

```bash
cd backend
npm install
npm run build
pm2 start dist/server.js --name task-manager-backend
pm2 save
```

Useful PM2 commands:
```bash
pm2 logs task-manager-backend
pm2 restart task-manager-backend
pm2 status
```

### Hosting Options

#### Render
- create a new Web Service
- root directory: `backend`
- install command: `npm install`
- build command: `npm run build`
- start command: `npm start`
- add all backend environment variables in the Render dashboard

#### Railway
- point Railway at the `backend` directory
- install dependencies and run `npm run build`
- use `npm start` as the start command
- set environment variables in Railway project settings

#### AWS EC2
- provision Node.js and MongoDB access
- clone the repo
- build the backend with `npm run build`
- run with PM2
- put Nginx or another reverse proxy in front if needed

## Frontend Deployment

### Required Environment Variables
Frontend environment variables are baked in at build time.

```bash
VITE_API_BASE_URL=https://api.example.com
```

### Build Steps
```bash
cd frontend
npm install
npm run build
```

The output is generated in `frontend/dist/`.

### Preview Locally
```bash
cd frontend
npm run preview
```

The preview server is configured for port `4173`.

### Hosting Options

#### Vercel
- import the repository
- set the project root to `frontend`
- build command: `npm run build`
- output directory: `dist`
- set `VITE_API_BASE_URL` in the Vercel environment settings
- configure SPA rewrites if needed for client-side routing

#### Netlify
- base directory: `frontend`
- build command: `npm run build`
- publish directory: `dist`
- set `VITE_API_BASE_URL`
- add an SPA redirect rule so routes such as `/projects/:projectId` resolve to `index.html`

## Important Production Configurations

### CORS
The backend uses a single configured origin from `CLIENT_ORIGIN`.

Production checklist:
- set `CLIENT_ORIGIN` to the exact frontend URL
- keep `credentials: true`
- ensure the frontend uses `withCredentials: true`

### Cookie Settings
For production cookies, pay attention to:

- `httpOnly`
  - already enabled in code
- `secure`
  - should be `true` in production
- `sameSite`
  - use `lax` when frontend and backend are same-site
  - use `none` when they are cross-site and served over HTTPS
- `domain`
  - set only if you need shared cookies across subdomains

### Environment Separation

#### Development
- frontend: `http://localhost:3000`
- backend: `http://localhost:5000`
- `COOKIE_SECURE=false`
- `COOKIE_SAME_SITE=lax`

#### Production
- frontend and backend use real HTTPS origins
- `COOKIE_SECURE=true`
- `COOKIE_SAME_SITE` chosen based on origin relationship
- `CLIENT_ORIGIN` updated to production frontend origin

## Deployment Checklist

### Backend
- MongoDB is reachable from the runtime
- all required environment variables are set
- `npm run build` passes
- service starts successfully with `npm start`
- CORS origin matches the frontend
- cookie settings are correct for production topology

### Frontend
- `VITE_API_BASE_URL` points to the deployed backend
- `npm run build` passes
- static hosting serves `index.html` for SPA routes
- browser can send cookies to the backend successfully

## Post-Deployment Smoke Test
Run these checks after deployment:

1. Open the frontend.
2. Sign up or log in.
3. Confirm `/api/auth/me` works through the browser session.
4. Create a project.
5. Open the board.
6. Create a task.
7. Move the task to another column.
8. Refresh the page and confirm the session and task state persist.
