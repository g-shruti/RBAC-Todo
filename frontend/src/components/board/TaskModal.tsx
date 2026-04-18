import { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

import { BoardColumn, Task } from "../../types/task";

interface TaskModalValues {
  columnId: string;
  title: string;
  description: string;
  dueDate: string;
}

interface TaskModalProps {
  isOpen: boolean;
  columns: BoardColumn[];
  initialTask?: Task | null;
  defaultColumnId?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: TaskModalValues) => Promise<void>;
  onDelete?: (task: Task) => Promise<void>;
}

const buildInitialValues = (columns: BoardColumn[], task?: Task | null, defaultColumnId?: string): TaskModalValues => ({
  columnId: task?.columnId ?? defaultColumnId ?? columns[0]?.id ?? "",
  title: task?.title ?? "",
  description: task?.description ?? "",
  dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
});

export const TaskModal = ({
  isOpen,
  columns,
  initialTask,
  defaultColumnId,
  isSubmitting,
  onClose,
  onSubmit,
  onDelete,
}: TaskModalProps) => {
  const [values, setValues] = useState<TaskModalValues>(buildInitialValues(columns, initialTask, defaultColumnId));

  useEffect(() => {
    if (isOpen) {
      setValues(buildInitialValues(columns, initialTask, defaultColumnId));
    }
  }, [columns, defaultColumnId, initialTask, isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={onClose}>{initialTask ? "Edit task" : "Create task"}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="task-column">Column</Label>
            <Input
              id="task-column"
              type="select"
              value={values.columnId}
              onChange={(event) => setValues((current) => ({ ...current, columnId: event.target.value }))}
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.name}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="task-title">Title</Label>
            <Input
              id="task-title"
              value={values.title}
              onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
              placeholder="Summarize the task"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="task-description">Description</Label>
            <Input
              id="task-description"
              type="textarea"
              rows={4}
              value={values.description}
              onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
              placeholder="Add a short description"
            />
          </FormGroup>

          <FormGroup className="mb-0">
            <Label for="task-due-date">Due date</Label>
            <Input
              id="task-due-date"
              type="date"
              value={values.dueDate}
              onChange={(event) => setValues((current) => ({ ...current, dueDate: event.target.value }))}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter className="justify-content-between">
          <div>
            {initialTask && onDelete ? (
              <Button color="danger" outline disabled={isSubmitting} onClick={() => onDelete(initialTask)}>
                Delete
              </Button>
            ) : null}
          </div>
          <div className="d-flex gap-2">
            <Button color="secondary" outline disabled={isSubmitting} onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" disabled={isSubmitting || !values.title.trim()}>
              {isSubmitting ? "Saving..." : initialTask ? "Save changes" : "Create task"}
            </Button>
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
