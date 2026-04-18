import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

import { ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email, password });
      const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? ROUTES.dashboard;
      navigate(nextPath, { replace: true });
    } catch (submitError) {
      setError(getErrorMessage(submitError).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="auth-card">
      <CardBody className="p-4 p-md-5">
        <CardTitle tag="h1" className="h3 mb-2">
          Welcome back
        </CardTitle>
        <CardSubtitle className="mb-4 text-secondary">
          Sign in to manage projects and keep the Kanban board moving.
        </CardSubtitle>

        {error ? <Alert color="danger">{error}</Alert> : null}

        <Form onSubmit={handleSubmit} className="d-grid gap-3">
          <FormGroup>
            <Label for="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              invalid={password.length > 0 && password.length < 8}
              placeholder="Enter your password"
              required
            />
            <FormFeedback>Password must be at least 8 characters.</FormFeedback>
          </FormGroup>

          <Button color="primary" size="lg" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </Form>

        <p className="mb-0 mt-4 text-center text-secondary">
          New here?{" "}
          <Link to={ROUTES.signup} className="fw-semibold text-primary">
            Create an account
          </Link>
        </p>
      </CardBody>
    </Card>
  );
};
