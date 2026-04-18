import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardText, CardTitle } from "reactstrap";

import { ROUTES } from "../../constants/routes";
import { Project } from "../../types/project";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="soft-card h-100 border-0 bg-white">
      <CardBody className="d-flex flex-column">
        <CardTitle tag="h3" className="h5">
          {project.name}
        </CardTitle>
        <CardText className="mb-3 text-secondary">
          {project.description?.trim() || "A clean project workspace ready for collaborative task tracking."}
        </CardText>
        <div className="mt-auto">
          <Button tag={Link} color="primary" to={ROUTES.project(project.id)}>
            Open board
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
