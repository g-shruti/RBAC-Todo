import { Navigate, Outlet } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { PageLoader } from "../components/common/PageLoader";

export const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader label="Loading session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return (
    <div className="auth-shell d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={9} lg={7} xl={5}>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
