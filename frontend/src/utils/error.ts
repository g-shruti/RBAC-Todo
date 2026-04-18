import axios from "axios";

import { AppError, ApiErrorResponse } from "../types/api";

export const getErrorMessage = (error: unknown, fallback = "Something went wrong."): AppError => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return {
      message: error.response?.data?.message ?? fallback,
      errorCode: error.response?.data?.errorCode,
      statusCode: error.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: fallback };
};
