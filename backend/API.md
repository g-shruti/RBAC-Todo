# Backend API Reference

## Conventions

### Base URL
Local default:
```text
http://localhost:5000
```

### Authentication
- Auth uses an HTTP-only cookie named `token`
- The frontend must send requests with credentials
- Protected routes require a valid cookie set by signup or login

### Success Response Format
```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Human readable message",
  "errorCode": "OPTIONAL_ERROR_CODE"
}
```

## Health

### `GET /health`
Returns a simple health response.

#### Request Body
None.

#### Success Response
```json
{
  "success": true,
  "message": "Task management backend is running.",
  "data": null
}
```

#### Error Cases
- `500 INTERNAL_SERVER_ERROR`

## Authentication APIs

### `POST /api/auth/signup`
Creates a new user account and sets the auth cookie.

#### Request Body
```json
{
  "name": "Shruti Jain",
  "email": "shruti@example.com",
  "password": "password123"
}
```

#### Success Response
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Shruti Jain",
      "email": "shruti@example.com"
    }
  }
}
```

#### Error Cases
- `400 VALIDATION_ERROR`
  - invalid email
  - password shorter than 8 characters
  - name outside allowed length
- `409 USER_ALREADY_EXISTS`
- `429 RATE_LIMIT_EXCEEDED`
- `500 INTERNAL_SERVER_ERROR`

### `POST /api/auth/login`
Authenticates an existing user and sets the auth cookie.

#### Request Body
```json
{
  "email": "shruti@example.com",
  "password": "password123"
}
```

#### Success Response
```json
{
  "success": true,
  "message": "User logged in successfully.",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Shruti Jain",
      "email": "shruti@example.com"
    }
  }
}
```

#### Error Cases
- `400 VALIDATION_ERROR`
- `401 INVALID_CREDENTIALS`
- `429 RATE_LIMIT_EXCEEDED`
- `500 INTERNAL_SERVER_ERROR`

### `GET /api/auth/me`
Returns the currently authenticated user from the auth cookie.

#### Request Body
None.

#### Success Response
```json
{
  "success": true,
  "message": "Authenticated user fetched successfully.",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Shruti Jain",
      "email": "shruti@example.com"
    }
  }
}
```

#### Error Cases
- `401 AUTH_REQUIRED`
- `401 INVALID_TOKEN`
- `500 INTERNAL_SERVER_ERROR`

## Project APIs

### `GET /api/projects`
Returns all projects owned by the authenticated user.

#### Request Body
None.

#### Success Response
```json
{
  "success": true,
  "message": "Projects fetched successfully.",
  "data": {
    "projects": [
      {
        "id": "project_id",
        "name": "Launch Board",
        "description": "Track launch work",
        "createdAt": "2026-04-18T05:29:49.554Z",
        "updatedAt": "2026-04-18T05:29:49.554Z"
      }
    ]
  }
}
```

#### Error Cases
- `401 AUTH_REQUIRED`
- `401 INVALID_TOKEN`
- `500 INTERNAL_SERVER_ERROR`

### `POST /api/projects`
Creates a new project for the authenticated user and automatically creates the default board columns.

#### Request Body
```json
{
  "name": "Launch Board",
  "description": "Track launch work"
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Project created successfully.",
  "data": {
    "project": {
      "id": "project_id",
      "name": "Launch Board",
      "description": "Track launch work",
      "createdAt": "2026-04-18T05:29:49.554Z",
      "updatedAt": "2026-04-18T05:29:49.554Z"
    }
  }
}
```

#### Error Cases
- `400 VALIDATION_ERROR`
- `401 AUTH_REQUIRED`
- `409 PROJECT_ALREADY_EXISTS`
- `500 INTERNAL_SERVER_ERROR`

### `GET /api/projects/:projectId`
Returns a single project owned by the authenticated user.

#### Request Body
None.

#### Success Response
```json
{
  "success": true,
  "message": "Project fetched successfully.",
  "data": {
    "project": {
      "id": "project_id",
      "name": "Launch Board",
      "description": "Track launch work",
      "createdAt": "2026-04-18T05:29:49.554Z",
      "updatedAt": "2026-04-18T05:29:49.554Z"
    }
  }
}
```

#### Error Cases
- `400 INVALID_ID`
- `401 AUTH_REQUIRED`
- `404 PROJECT_NOT_FOUND`
- `500 INTERNAL_SERVER_ERROR`

### `GET /api/projects/:projectId/board`
Returns the full board payload for a project, including project metadata, columns, and tasks.

#### Request Body
None.

#### Success Response
```json
{
  "success": true,
  "message": "Project board fetched successfully.",
  "data": {
    "project": {
      "id": "project_id",
      "name": "Launch Board",
      "description": "Track launch work",
      "createdAt": "2026-04-18T05:29:49.554Z",
      "updatedAt": "2026-04-18T05:29:49.554Z"
    },
    "columns": [
      {
        "id": "column_todo",
        "projectId": "project_id",
        "name": "To Do",
        "key": "todo",
        "order": 0
      },
      {
        "id": "column_in_progress",
        "projectId": "project_id",
        "name": "In Progress",
        "key": "in-progress",
        "order": 1
      }
    ],
    "tasks": [
      {
        "id": "task_id",
        "projectId": "project_id",
        "columnId": "column_todo",
        "title": "Prepare release notes",
        "description": "Draft and review release messaging.",
        "order": 0,
        "createdAt": "2026-04-18T05:31:41.324Z",
        "updatedAt": "2026-04-18T05:31:41.324Z"
      }
    ]
  }
}
```

#### Error Cases
- `400 INVALID_ID`
- `401 AUTH_REQUIRED`
- `404 PROJECT_NOT_FOUND`
- `500 INTERNAL_SERVER_ERROR`

## Task APIs

### `POST /api/projects/:projectId/tasks`
Creates a task in a specific project column.

#### Request Body
```json
{
  "columnId": "column_todo",
  "title": "Prepare release notes",
  "description": "Draft and review release messaging.",
  "dueDate": "2026-04-30"
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "task": {
      "id": "task_id",
      "projectId": "project_id",
      "columnId": "column_todo",
      "title": "Prepare release notes",
      "description": "Draft and review release messaging.",
      "order": 0,
      "dueDate": "2026-04-30T00:00:00.000Z",
      "createdAt": "2026-04-18T05:31:41.324Z",
      "updatedAt": "2026-04-18T05:31:41.324Z"
    }
  }
}
```

#### Error Cases
- `400 VALIDATION_ERROR`
- `400 INVALID_ID`
- `400 INVALID_COLUMN`
- `401 AUTH_REQUIRED`
- `404 PROJECT_NOT_FOUND`
- `500 INTERNAL_SERVER_ERROR`

### `PATCH /api/tasks/:taskId`
Updates editable task fields.

#### Request Body
```json
{
  "title": "Prepare final release notes",
  "description": "Draft, review, and finalize release messaging.",
  "dueDate": "2026-05-02"
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Task updated successfully.",
  "data": {
    "task": {
      "id": "task_id",
      "projectId": "project_id",
      "columnId": "column_todo",
      "title": "Prepare final release notes",
      "description": "Draft, review, and finalize release messaging.",
      "order": 0,
      "dueDate": "2026-05-02T00:00:00.000Z",
      "createdAt": "2026-04-18T05:31:41.324Z",
      "updatedAt": "2026-04-18T05:35:00.000Z"
    }
  }
}
```

#### Error Cases
- `400 VALIDATION_ERROR`
- `400 INVALID_ID`
- `401 AUTH_REQUIRED`
- `404 PROJECT_NOT_FOUND`
- `404 TASK_NOT_FOUND`
- `500 INTERNAL_SERVER_ERROR`

### `PATCH /api/tasks/:taskId/move`
Moves a task to a different column and persists its new order.

#### Request Body
```json
{
  "columnId": "column_in_progress",
  "order": 0
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Task moved successfully.",
  "data": {
    "task": {
      "id": "task_id",
      "projectId": "project_id",
      "columnId": "column_in_progress",
      "title": "Prepare release notes",
      "description": "Draft and review release messaging.",
      "order": 0,
      "createdAt": "2026-04-18T05:31:41.324Z",
      "updatedAt": "2026-04-18T05:32:41.558Z"
    }
  }
}
```

#### Error Cases
- `400 VALIDATION_ERROR`
- `400 INVALID_ID`
- `400 INVALID_COLUMN`
- `401 AUTH_REQUIRED`
- `404 PROJECT_NOT_FOUND`
- `404 TASK_NOT_FOUND`
- `500 INTERNAL_SERVER_ERROR`

### `DELETE /api/tasks/:taskId`
Deletes a task and reorders the remaining tasks in the source column.

#### Request Body
None.

#### Success Response
```json
{
  "success": true,
  "message": "Task deleted successfully.",
  "data": {
    "deleted": true
  }
}
```

#### Error Cases
- `400 VALIDATION_ERROR`
- `400 INVALID_ID`
- `401 AUTH_REQUIRED`
- `404 PROJECT_NOT_FOUND`
- `404 TASK_NOT_FOUND`
- `500 INTERNAL_SERVER_ERROR`

## Notes
- There is no logout endpoint yet.
- The API uses cookie-based authentication only.
- Validation failures intentionally return a generic message rather than field-by-field details.
