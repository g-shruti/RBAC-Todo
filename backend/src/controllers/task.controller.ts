import { Request, Response } from "express";

import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { taskService } from "../services/task.service";
import { sendSuccess } from "../utils/apiResponse";

interface CreateTaskBody {
  columnId: string;
  title: string;
  description?: string;
  dueDate?: string;
}

interface UpdateTaskBody {
  title?: string;
  description?: string;
  dueDate?: string;
}

interface MoveTaskBody {
  columnId: string;
  order: number;
}

export class TaskController {
  async createTask(request: Request, response: Response): Promise<Response> {
    const task = await taskService.createTask(
      request.user!.id,
      String(request.params.projectId),
      request.body as CreateTaskBody,
    );

    return sendSuccess(response, HTTP_STATUS.CREATED, MESSAGES.TASK.CREATE_SUCCESS, {
      task,
    });
  }

  async updateTask(request: Request, response: Response): Promise<Response> {
    const task = await taskService.updateTask(request.user!.id, String(request.params.taskId), request.body as UpdateTaskBody);

    return sendSuccess(response, HTTP_STATUS.OK, MESSAGES.TASK.UPDATE_SUCCESS, {
      task,
    });
  }

  async moveTask(request: Request, response: Response): Promise<Response> {
    const task = await taskService.moveTask(request.user!.id, String(request.params.taskId), request.body as MoveTaskBody);

    return sendSuccess(response, HTTP_STATUS.OK, MESSAGES.TASK.MOVE_SUCCESS, {
      task,
    });
  }

  async deleteTask(request: Request, response: Response): Promise<Response> {
    await taskService.deleteTask(request.user!.id, String(request.params.taskId));

    return sendSuccess(response, HTTP_STATUS.OK, MESSAGES.TASK.DELETE_SUCCESS, {
      deleted: true,
    });
  }
}

export const taskController = new TaskController();
