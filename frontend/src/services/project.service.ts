import { apiClient } from "../api/axios";
import { ApiSuccessResponse } from "../types/api";
import { CreateProjectInput, Project } from "../types/project";
import { BoardData } from "../types/task";

export const projectService = {
  async getProjects() {
    const response = await apiClient.get<ApiSuccessResponse<{ projects: Project[] }>>("/api/projects");
    return response.data.data.projects;
  },

  async createProject(payload: CreateProjectInput) {
    const response = await apiClient.post<ApiSuccessResponse<{ project: Project }>>("/api/projects", payload);
    return response.data.data.project;
  },

  async getBoard(projectId: string) {
    const response = await apiClient.get<ApiSuccessResponse<BoardData>>(`/api/projects/${projectId}/board`);
    return response.data.data;
  },
};
