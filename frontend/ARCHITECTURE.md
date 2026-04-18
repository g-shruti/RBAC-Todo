# Frontend Architecture

## Overview
The frontend is a React single-page application built with Vite and TypeScript.

The architecture separates:
- route-level composition
- reusable UI components
- server-state hooks
- API services
- a shared Axios layer

This keeps pages readable and prevents direct API calls from spreading across the UI.

## Folder Structure
```text
frontend/src/
├── api/
├── components/
├── constants/
├── context/
├── hooks/
├── layouts/
├── pages/
├── services/
├── types/
├── utils/
├── App.tsx
├── main.tsx
└── index.css
```

## Component Hierarchy
```text
main.tsx
  -> QueryClientProvider
  -> BrowserRouter
  -> AuthProvider
  -> App

App
  -> AuthLayout
    -> LoginPage
    -> SignupPage
  -> ProtectedRoute
    -> AppLayout
      -> DashboardPage
      -> ProjectPage

ProjectPage
  -> Board
    -> Column
      -> TaskCard
  -> TaskModal
```

## Routing and Layouts

### `App.tsx`
Defines the route tree:
- `/login`
- `/signup`
- `/`
- `/projects/:projectId`

### `AuthLayout`
Used for login and signup.

Behavior:
- shows a loader while auth status is resolving
- redirects authenticated users to the dashboard

### `AppLayout`
Used for authenticated screens.

Includes:
- top navigation bar
- left sidebar
- route outlet for dashboard and board pages

## State Management

### React Query
React Query is used for server state:
- current user lookup
- projects list
- board data
- task mutations

Why it is used here:
- caching is built in
- request lifecycle state is standardized
- mutations can update cache without manual state duplication
- retries and refetch behavior are centralized

### Context API
Context is used only for auth/session state.

`AuthContext` exposes:
- `user`
- `isAuthenticated`
- `isLoading`
- `error`
- `login`
- `signup`
- `refreshUser`

This avoids mixing auth-specific logic into unrelated page components.

## API Integration Strategy

### Shared Axios Client
The shared Axios client lives in `src/api/axios.ts`.

It centralizes:
- `baseURL`
- `withCredentials: true`
- content-type defaults
- response error normalization

### Service Layer
Services wrap endpoint calls:
- `auth.service.ts`
- `project.service.ts`
- `task.service.ts`

Pages and components do not call Axios directly.

### Hooks Layer
Hooks wrap services with React Query:
- `useAuth`
- `useProjects`
- `useTasks(projectId)`

This keeps UI components focused on rendering and event handling.

## Authentication and Protected Routes
Authentication is cookie-based.

### Flow
1. Login or signup sends credentials to the backend.
2. The backend sets an HTTP-only cookie.
3. The frontend resolves auth state through `GET /api/auth/me`.
4. Protected pages render only if the current user query succeeds.

### `ProtectedRoute`
`ProtectedRoute`:
- shows a loading screen while auth is resolving
- redirects unauthenticated users to `/login`
- preserves the requested destination in router state

### Auth-Only Pages
`AuthLayout` redirects already authenticated users away from `/login` and `/signup`.

## Drag and Drop Implementation
The board uses `@dnd-kit/core` and `@dnd-kit/sortable`.

### Main Pieces
- `Board.tsx`
  - sets up `DndContext`
  - calculates the target column and order on drop
- `Column.tsx`
  - defines droppable columns
  - wraps task IDs in `SortableContext`
- `TaskCard.tsx`
  - uses `useSortable`
  - applies drag transforms and transitions
- `utils/board.ts`
  - contains task reorder helpers used for optimistic updates

### Persistence Strategy
Task movement is handled through `useTasks`.

`moveTask` mutation:
- optimistically updates the cached board
- rolls back on failure
- invalidates the board query after completion

This gives responsive UI behavior while still syncing with the server as the source of truth.

## UI Composition Principles
- pages own orchestration and screen-level state
- components stay reusable and focused
- form state remains close to the page or modal that owns it
- API and business flow stay outside presentation components

Examples:
- `DashboardPage` composes project creation and project listing
- `ProjectPage` composes board loading, modal state, and mutation flows
- `TaskModal` is reusable for both create and edit flows

## Styling Approach
- Bootstrap provides base styling primitives
- Reactstrap provides component wrappers
- `index.css` contains project-level layout and visual utilities
- `clsx` is used for conditional CSS classes

The styling is intentionally minimal and functional rather than animation-heavy.

## Important Constraints
- there is no logout flow yet
- auth depends on cookies, so frontend deployment must align with backend CORS and cookie settings
- the app uses `BrowserRouter`, so production hosting must support SPA route rewrites

## Summary
The frontend architecture is optimized for clarity:
- router and layouts handle access boundaries
- hooks own server-state orchestration
- services own API calls
- components own rendering

That makes the app easier to onboard into and easier to extend with future features such as RBAC-aware UI, richer project settings, or schema-driven task forms.
