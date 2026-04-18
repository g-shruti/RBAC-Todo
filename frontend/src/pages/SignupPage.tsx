import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signup({ name, email, password });
      navigate(ROUTES.dashboard, { replace: true });
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
          Create your workspace
        </CardTitle>
        <CardSubtitle className="mb-4 text-secondary">
          Start with a lightweight Kanban workspace backed by secure cookie authentication.
        </CardSubtitle>

        {error ? <Alert color="danger">{error}</Alert> : null}

        <Form onSubmit={handleSubmit} className="d-grid gap-3">
          <FormGroup>
            <Label for="signup-name">Name</Label>
            <Input
              id="signup-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              invalid={password.length > 0 && password.length < 8}
              placeholder="At least 8 characters"
              required
            />
            <FormFeedback>Password must be at least 8 characters.</FormFeedback>
          </FormGroup>

          <Button color="primary" size="lg" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </Form>

        <p className="mb-0 mt-4 text-center text-secondary">
          Already have an account?{" "}
          <Link to={ROUTES.login} className="fw-semibold text-primary">
            Sign in
          </Link>
        </p>
      </CardBody>
    </Card>
  );
};
