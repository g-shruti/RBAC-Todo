import axios from "axios";

import { ApiErrorResponse } from "../types/api";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "Something went wrong while communicating with the server.";

    const normalizedError = {
      ...error,
      message,
      response: error.response
        ? {
            ...error.response,
            data: {
              ...(error.response.data as ApiErrorResponse | undefined),
              message,
            },
          }
        : undefined,
    };

    return Promise.reject(normalizedError);
  },
);
