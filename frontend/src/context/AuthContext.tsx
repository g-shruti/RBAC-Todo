import { ReactNode, createContext, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "../constants/queryKeys";
import { authService } from "../services/auth.service";
import { AppError } from "../types/api";
import { LoginInput, SignupInput, User } from "../types/auth";
import { getErrorMessage } from "../utils/error";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AppError | null;
  login: (payload: LoginInput) => Promise<User>;
  signup: (payload: SignupInput) => Promise<User>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: QUERY_KEYS.authUser,
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (user) => {
      queryClient.setQueryData(QUERY_KEYS.authUser, user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: (user) => {
      queryClient.setQueryData(QUERY_KEYS.authUser, user);
    },
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      isAuthenticated: Boolean(meQuery.data),
      isLoading: meQuery.isLoading,
      error: meQuery.error ? getErrorMessage(meQuery.error) : null,
      login: async (payload) => loginMutation.mutateAsync(payload),
      signup: async (payload) => signupMutation.mutateAsync(payload),
      refreshUser: async () => {
        try {
          const user = await queryClient.fetchQuery({
            queryKey: QUERY_KEYS.authUser,
            queryFn: authService.getCurrentUser,
          });

          return user;
        } catch {
          queryClient.setQueryData(QUERY_KEYS.authUser, null);
          return null;
        }
      },
    }),
    [
      loginMutation,
      meQuery.data,
      meQuery.error,
      meQuery.isLoading,
      queryClient,
      signupMutation,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider.");
  }

  return context;
};
