import { Link } from "react-router-dom";
import { Container, Navbar as ReactstrapNavbar, NavbarBrand, NavbarText } from "reactstrap";

import { ROUTES } from "../../constants/routes";
import { User } from "../../types/auth";

interface NavbarProps {
  user: User | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  return (
    <ReactstrapNavbar className="border-bottom bg-white py-3" light expand="md">
      <Container fluid className="px-4">
        <NavbarBrand tag={Link} to={ROUTES.dashboard} className="fw-semibold">
          TaskFlow
        </NavbarBrand>
        <NavbarText className="text-secondary">{user ? `Signed in as ${user.name}` : "Task management"}</NavbarText>
      </Container>
    </ReactstrapNavbar>
  );
};
