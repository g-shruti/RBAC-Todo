import { arrayMove } from "@dnd-kit/sortable";

import { BoardData, Task } from "../types/task";

const sortTasks = (tasks: Task[]): Task[] =>
  [...tasks].sort((left, right) => left.order - right.order);

export const getTasksForColumn = (tasks: Task[], columnId: string): Task[] =>
  sortTasks(tasks.filter((task) => task.columnId === columnId));

export const reorderBoardTasks = (
  board: BoardData,
  taskId: string,
  destinationColumnId: string,
  destinationIndex: number,
): BoardData => {
  const task = board.tasks.find((item) => item.id === taskId);

  if (!task) {
    return board;
  }

  const sourceTasks = getTasksForColumn(board.tasks, task.columnId);
  const destinationTasks =
    task.columnId === destinationColumnId ? sourceTasks : getTasksForColumn(board.tasks, destinationColumnId);

  const sourceIndex = sourceTasks.findIndex((item) => item.id === taskId);

  if (sourceIndex === -1) {
    return board;
  }

  let updatedSourceTasks = [...sourceTasks];
  let updatedDestinationTasks = [...destinationTasks];

  if (task.columnId === destinationColumnId) {
    updatedDestinationTasks = arrayMove(destinationTasks, sourceIndex, destinationIndex).map((item, index) => ({
      ...item,
      order: index,
    }));
  } else {
    const [movedTask] = updatedSourceTasks.splice(sourceIndex, 1);
    updatedDestinationTasks.splice(destinationIndex, 0, {
      ...movedTask,
      columnId: destinationColumnId,
    });

    updatedSourceTasks = updatedSourceTasks.map((item, index) => ({
      ...item,
      order: index,
    }));

    updatedDestinationTasks = updatedDestinationTasks.map((item, index) => ({
      ...item,
      order: index,
    }));
  }

  const mergedTasks = board.tasks
    .filter((item) => {
      if (item.columnId === task.columnId) {
        return false;
      }

      if (item.columnId === destinationColumnId) {
        return false;
      }

      return true;
    })
    .concat(task.columnId === destinationColumnId ? updatedDestinationTasks : [...updatedSourceTasks, ...updatedDestinationTasks]);

  return {
    ...board,
    tasks: mergedTasks,
  };
};
