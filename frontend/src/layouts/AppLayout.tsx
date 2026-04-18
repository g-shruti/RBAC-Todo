import { Outlet } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { Navbar } from "../components/common/Navbar";
import { Sidebar } from "../components/common/Sidebar";
import { useAuth } from "../hooks/useAuth";

export const AppLayout = () => {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Navbar user={user} />
      <Container fluid className="px-0">
        <Row className="g-0">
          <Col lg={2} xl={2}>
            <Sidebar />
          </Col>
          <Col lg={10} xl={10} className="content-panel">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
