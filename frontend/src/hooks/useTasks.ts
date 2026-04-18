import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "../constants/queryKeys";
import { projectService } from "../services/project.service";
import { taskService } from "../services/task.service";
import { CreateTaskInput, MoveTaskInput, UpdateTaskInput } from "../types/task";
import { reorderBoardTasks } from "../utils/board";

export const useTasks = (projectId: string) => {
  const queryClient = useQueryClient();
  const boardQueryKey = QUERY_KEYS.board(projectId);

  const boardQuery = useQuery({
    queryKey: boardQueryKey,
    queryFn: () => projectService.getBoard(projectId),
    enabled: Boolean(projectId),
  });

  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskInput) => taskService.createTask(projectId, payload),
    onSuccess: (task) => {
      queryClient.setQueryData(boardQueryKey, (current: typeof boardQuery.data) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          tasks: [...current.tasks, task],
        };
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskInput }) =>
      taskService.updateTask(taskId, payload),
    onSuccess: (task) => {
      queryClient.setQueryData(boardQueryKey, (current: typeof boardQuery.data) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          tasks: current.tasks.map((item) => (item.id === task.id ? task : item)),
        };
      });
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: (payload: MoveTaskInput) => taskService.moveTask(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: boardQueryKey });
      const previousBoard = queryClient.getQueryData(boardQueryKey);

      queryClient.setQueryData(boardQueryKey, (current: typeof boardQuery.data) => {
        if (!current) {
          return current;
        }

        return reorderBoardTasks(current, payload.taskId, payload.columnId, payload.order);
      });

      return { previousBoard };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(boardQueryKey, context.previousBoard);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey }).catch(() => undefined);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: (_result, taskId) => {
      queryClient.setQueryData(boardQueryKey, (current: typeof boardQuery.data) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          tasks: current.tasks.filter((task) => task.id !== taskId),
        };
      });
    },
  });

  return {
    board: boardQuery.data,
    isLoading: boardQuery.isLoading,
    isError: boardQuery.isError,
    error: boardQuery.error,
    refetch: boardQuery.refetch,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    moveTask: moveTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    isCreatingTask: createTaskMutation.isPending,
    isUpdatingTask: updateTaskMutation.isPending || moveTaskMutation.isPending,
  };
};
