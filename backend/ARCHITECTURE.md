# Backend Architecture

## Overview
The backend is structured as a layered TypeScript service built on Express and Mongoose. It is intentionally small in scope, but it uses production-ready boundaries so new features can be added without pushing business logic into route handlers.

## Folder Structure
```text
backend/src/
├── config/
├── constants/
├── controllers/
├── logger/
├── middleware/
├── models/
├── repositories/
├── routes/
├── services/
├── types/
├── utils/
└── validators/
```

## Layer Responsibilities

### `routes/`
Routes define:
- URL paths
- HTTP methods
- middleware order
- which controller method handles the request

Examples:
- auth routes in `src/routes/auth.routes.ts`
- project routes in `src/routes/project.routes.ts`
- task routes in `src/routes/task.routes.ts`

### `controllers/`
Controllers:
- receive the prepared `Request`
- call services
- return standardized responses via `sendSuccess`

Controllers do not contain database logic and keep request/response mapping thin.

### `services/`
Services contain the main business rules, including:
- duplicate user and duplicate project checks
- project ownership checks
- task move and reorder logic
- auth token creation and password verification
- default board column creation for new projects

Services throw `AppError` for expected failures.

### `repositories/`
Repositories isolate persistence operations from business logic.

Examples:
- finding users by email
- creating projects
- reading board columns by project
- updating tasks and counting tasks in a column

This keeps services focused on behavior instead of query syntax.

### `models/`
Models define:
- schema shape
- indexes
- field-level constraints that belong in persistence

Examples:
- unique user email
- unique `(ownerId, name)` for projects
- ordered task indexes per column

### `middleware/`
Middleware handles cross-cutting concerns:
- async controller wrapping
- auth enforcement
- validation
- request logging
- error normalization
- rate limiting
- basic request sanitization

### `validators/`
Validators use Zod to define strict request contracts for:
- auth requests
- project creation and project params
- task creation, update, move, and delete params

## Request Flow
```text
HTTP request
  -> route
  -> auth/validation middleware
  -> controller
  -> service
  -> repository
  -> mongoose model
  -> MongoDB
  -> response
```

## Error Handling Strategy
The backend uses centralized error handling.

### Components
- `AppError`
  - represents expected domain failures
  - carries `statusCode` and optional `errorCode`
- `asyncHandler`
  - wraps async controllers so they can throw normally
- `errorHandler`
  - converts all errors into the shared JSON error shape

### Error Categories
- validation failures from Zod
- expected domain failures such as:
  - duplicate user
  - invalid credentials
  - unauthorized access
  - invalid object IDs
  - invalid column ownership
- unexpected runtime errors

This prevents repetitive `try/catch` blocks in controllers and keeps error formatting consistent.

## Logging System
Logging uses a simple custom console logger.

### Request Logging
`requestLogger.middleware.ts` records:
- HTTP method
- request URL
- response status code
- response time in milliseconds

### Error Logging
`error.middleware.ts` logs:
- handled `AppError` cases
- validation failures
- unexpected exceptions with stack information

This is enough for local development and small-scale production environments, while leaving room for later adoption of a centralized logging platform.

## Validation Approach
Validation uses Zod schemas plus service-level object ID checks.

### Why Both Layers Exist
- Zod validates the incoming request shape
- service-level validation checks domain-specific constraints such as whether an ID is a valid MongoDB ObjectId

This separation keeps schemas readable while preserving domain safety.

## DRY and SOLID Application

### DRY
The backend avoids duplication by centralizing:
- response formatting in `utils/apiResponse.ts`
- error creation in `utils/appError.ts`
- JWT logic in `utils/jwt.ts`
- cookie options in `utils/cookies.ts`
- validation middleware in `middleware/validate.middleware.ts`
- logging in `logger/logger.ts`

### SOLID
- **Single Responsibility**
  - controllers, services, repositories, and models each have focused responsibilities
- **Open/Closed**
  - new resources can be added by following the same route/controller/service/repository pattern
- **Liskov Substitution**
  - not heavily object-oriented here, but utilities and contracts remain predictable and composable
- **Interface Segregation**
  - the code prefers small typed DTOs instead of oversized shared objects
- **Dependency Inversion**
  - services depend on repository abstractions and utility functions rather than embedding raw persistence logic

## Authentication Design
Authentication is implemented with:
- bcrypt password hashing
- JWT signing
- HTTP-only cookie storage
- middleware-based session resolution via `/api/auth/me`

This keeps the frontend stateless with respect to token storage and reduces token handling risk in browser code.

## Extensibility Notes
The current backend is deliberately prepared for future additions:

### RBAC
Not implemented yet, but ready for:
- `ProjectUser` membership model
- role checks at the service layer
- richer auth claims if needed

### Dynamic Task Schema
Not implemented yet, but the project/board/task split leaves room for:
- project-level form definitions
- custom task metadata
- schema-driven task rendering in the frontend

## Summary
The backend is intentionally conservative:
- thin controllers
- service-owned business rules
- repository-owned persistence
- centralized error and logging behavior

That makes the current feature set easier to understand and gives future contributors a clear place to add new behavior.
