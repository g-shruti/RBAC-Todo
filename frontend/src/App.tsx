import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { ROUTES } from "./constants/routes";
import { AppLayout } from "./layouts/AppLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { ProjectPage } from "./pages/ProjectPage";
import { SignupPage } from "./pages/SignupPage";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.signup} element={<SignupPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.project(":projectId")} element={<ProjectPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  );
}

export default App;
