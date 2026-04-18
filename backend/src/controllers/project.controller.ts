import { Request, Response } from "express";

import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { projectService } from "../services/project.service";
import { sendSuccess } from "../utils/apiResponse";

interface CreateProjectBody {
  name: string;
  description?: string;
}

export class ProjectController {
  async getProjects(request: Request, response: Response): Promise<Response> {
    const projects = await projectService.getProjects(request.user!.id);

    return sendSuccess(response, HTTP_STATUS.OK, MESSAGES.PROJECT.FETCH_ALL_SUCCESS, {
      projects,
    });
  }

  async createProject(request: Request, response: Response): Promise<Response> {
    const project = await projectService.createProject(request.user!.id, request.body as CreateProjectBody);

    return sendSuccess(response, HTTP_STATUS.CREATED, MESSAGES.PROJECT.CREATE_SUCCESS, {
      project,
    });
  }

  async getProject(request: Request, response: Response): Promise<Response> {
    const project = await projectService.getProject(request.user!.id, String(request.params.projectId));

    return sendSuccess(response, HTTP_STATUS.OK, MESSAGES.PROJECT.FETCH_ONE_SUCCESS, {
      project,
    });
  }

  async getBoard(request: Request, response: Response): Promise<Response> {
    const board = await projectService.getBoard(request.user!.id, String(request.params.projectId));

    return sendSuccess(response, HTTP_STATUS.OK, MESSAGES.PROJECT.FETCH_BOARD_SUCCESS, board);
  }
}

export const projectController = new ProjectController();
