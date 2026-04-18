import { FormEvent, useState } from "react";
import { Alert, Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import { EmptyState } from "../components/common/EmptyState";
import { ProjectCard } from "../components/projects/ProjectCard";
import { useProjects } from "../hooks/useProjects";
import { getErrorMessage } from "../utils/error";

export const DashboardPage = () => {
  const { projects, isLoading, isError, error, createProject, isCreatingProject } = useProjects();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCreateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      await createProject({
        name,
        description: description.trim() || undefined,
      });
      setName("");
      setDescription("");
    } catch (createError) {
      setSubmitError(getErrorMessage(createError).message);
    }
  };

  return (
    <div className="page-section">
      <Row className="g-4">
        <Col xl={4}>
          <Card className="soft-card border-0 bg-white">
            <CardBody>
              <h1 className="h4 mb-2">Your projects</h1>
              <p className="text-secondary">
                Create focused workspaces for each initiative and keep tasks moving across columns.
              </p>

              {submitError ? <Alert color="danger">{submitError}</Alert> : null}

              <Form onSubmit={handleCreateProject} className="d-grid gap-3">
                <FormGroup>
                  <Label for="project-name">Project name</Label>
                  <Input
                    id="project-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Q2 Product Launch"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="project-description">Description</Label>
                  <Input
                    id="project-description"
                    type="textarea"
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Add a short summary for this board"
                  />
                </FormGroup>
                <Button color="primary" disabled={isCreatingProject || !name.trim()}>
                  {isCreatingProject ? "Creating..." : "Create project"}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col xl={8}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="h4 mb-1">Boards</h2>
              <p className="mb-0 text-secondary">Choose a project to open its Kanban board.</p>
            </div>
          </div>

          {isLoading ? (
            <Row className="g-3">
              {[1, 2, 3].map((item) => (
                <Col key={item} md={6}>
                  <Card className="soft-card border-0 bg-white">
                    <CardBody className="py-5 text-center text-secondary">Loading project...</CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : null}

          {isError ? <Alert color="danger">{getErrorMessage(error).message}</Alert> : null}

          {!isLoading && !projects.length ? (
            <EmptyState
              title="No projects yet"
              description="Create your first project to start planning tasks on a Kanban board."
            />
          ) : null}

          <Row className="g-3">
            {projects.map((project) => (
              <Col key={project.id} md={6}>
                <ProjectCard project={project} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};
