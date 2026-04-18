import { apiClient } from "../api/axios";
import { ApiSuccessResponse } from "../types/api";
import { AuthPayload, LoginInput, SignupInput } from "../types/auth";

export const authService = {
  async getCurrentUser() {
    const response = await apiClient.get<ApiSuccessResponse<AuthPayload>>("/api/auth/me");
    return response.data.data.user;
  },

  async login(payload: LoginInput) {
    const response = await apiClient.post<ApiSuccessResponse<AuthPayload>>("/api/auth/login", payload);
    return response.data.data.user;
  },

  async signup(payload: SignupInput) {
    const response = await apiClient.post<ApiSuccessResponse<AuthPayload>>("/api/auth/signup", payload);
    return response.data.data.user;
  },
};
