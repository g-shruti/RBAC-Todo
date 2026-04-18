import { apiClient } from "../api/axios";
import { ApiSuccessResponse } from "../types/api";
import { CreateTaskInput, MoveTaskInput, Task, UpdateTaskInput } from "../types/task";

export const taskService = {
  async createTask(projectId: string, payload: CreateTaskInput) {
    const response = await apiClient.post<ApiSuccessResponse<{ task: Task }>>(
      `/api/projects/${projectId}/tasks`,
      payload,
    );
    return response.data.data.task;
  },

  async updateTask(taskId: string, payload: UpdateTaskInput) {
    const response = await apiClient.patch<ApiSuccessResponse<{ task: Task }>>(`/api/tasks/${taskId}`, payload);
    return response.data.data.task;
  },

  async moveTask(payload: MoveTaskInput) {
    const response = await apiClient.patch<ApiSuccessResponse<{ task: Task }>>(
      `/api/tasks/${payload.taskId}/move`,
      {
        columnId: payload.columnId,
        order: payload.order,
      },
    );
    return response.data.data.task;
  },

  async deleteTask(taskId: string) {
    await apiClient.delete(`/api/tasks/${taskId}`);
  },
};
