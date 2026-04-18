import clsx from "clsx";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Badge, Button } from "reactstrap";

import { BoardColumn, Task } from "../../types/task";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  column: BoardColumn;
  tasks: Task[];
  onCreateTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
}

export const Column = ({ column, tasks, onCreateTask, onEditTask }: ColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  return (
    <div ref={setNodeRef} className={clsx("board-column p-3", { "column-drop-active": isOver })}>
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div>
          <h3 className="h6 mb-1">{column.name}</h3>
          <Badge color="light" className="text-secondary">
            {tasks.length} tasks
          </Badge>
        </div>
        <Button color="primary" size="sm" outline onClick={() => onCreateTask(column.id)}>
          Add task
        </Button>
      </div>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="d-grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
