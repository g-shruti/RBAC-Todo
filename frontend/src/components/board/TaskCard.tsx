import clsx from "clsx";
import { Button, Card, CardBody, CardText, CardTitle } from "reactstrap";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Task } from "../../types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <Card className={clsx("task-card border-0", { dragging: isDragging })}>
        <CardBody>
          <CardTitle tag="h4" className="h6">
            {task.title}
          </CardTitle>
          {task.description ? <CardText className="text-secondary small">{task.description}</CardText> : null}
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-secondary">
              {task.dueDate ? `Due ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
            </small>
            <Button color="link" className="p-0 text-decoration-none" onClick={() => onEdit(task)}>
              Edit
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
