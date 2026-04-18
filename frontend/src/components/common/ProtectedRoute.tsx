import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { PageLoader } from "./PageLoader";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
