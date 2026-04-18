import { useMemo } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { BoardData, Task } from "../../types/task";
import { getTasksForColumn } from "../../utils/board";
import { Column } from "./Column";

interface BoardProps {
  board: BoardData;
  onCreateTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onMoveTask: (taskId: string, columnId: string, order: number) => Promise<void>;
}

export const Board = ({ board, onCreateTask, onEditTask, onMoveTask }: BoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const orderedColumns = useMemo(
    () => [...board.columns].sort((left, right) => left.order - right.order),
    [board.columns],
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const activeTaskId = String(event.active.id);
    const activeTask = board.tasks.find((task) => task.id === activeTaskId);

    if (!activeTask || !event.over) {
      return;
    }

    const overId = String(event.over.id);
    const overTask = board.tasks.find((task) => task.id === overId);

    const destinationColumnId = overTask?.columnId ?? overId;
    const destinationTasks = getTasksForColumn(board.tasks, destinationColumnId);
    const destinationIndex = overTask
      ? destinationTasks.findIndex((task) => task.id === overTask.id)
      : destinationTasks.length;

    await onMoveTask(activeTask.id, destinationColumnId, destinationIndex);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={(event) => void handleDragEnd(event)}>
      <div className="board-grid">
        {orderedColumns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksForColumn(board.tasks, column.id)}
            onCreateTask={onCreateTask}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </DndContext>
  );
};
