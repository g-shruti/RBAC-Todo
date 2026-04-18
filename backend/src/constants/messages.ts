export const MESSAGES = {
  AUTH: {
    SIGNUP_SUCCESS: "User registered successfully.",
    LOGIN_SUCCESS: "User logged in successfully.",
    FETCH_ME_SUCCESS: "Authenticated user fetched successfully.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    UNAUTHORIZED: "Authentication required.",
    USER_EXISTS: "A user with this email already exists.",
  },
  PROJECT: {
    CREATE_SUCCESS: "Project created successfully.",
    FETCH_ALL_SUCCESS: "Projects fetched successfully.",
    FETCH_ONE_SUCCESS: "Project fetched successfully.",
    FETCH_BOARD_SUCCESS: "Project board fetched successfully.",
    NOT_FOUND: "Project not found.",
    DUPLICATE_NAME: "A project with this name already exists.",
  },
  TASK: {
    CREATE_SUCCESS: "Task created successfully.",
    UPDATE_SUCCESS: "Task updated successfully.",
    MOVE_SUCCESS: "Task moved successfully.",
    DELETE_SUCCESS: "Task deleted successfully.",
    NOT_FOUND: "Task not found.",
    INVALID_COLUMN: "The selected column does not belong to this project.",
  },
  APP: {
    HEALTH_OK: "Task management backend is running.",
    INTERNAL_SERVER_ERROR: "Something went wrong.",
    TOO_MANY_REQUESTS: "Too many requests. Please try again later.",
    VALIDATION_FAILED: "Request validation failed.",
  },
} as const;
