import { Project } from "./project";

export interface BoardColumn {
  id: string;
  projectId: string;
  name: string;
  key: string;
  order: number;
}

export interface Task {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description?: string;
  order: number;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardData {
  project: Project;
  columns: BoardColumn[];
  tasks: Task[];
}

export interface CreateTaskInput {
  columnId: string;
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
}

export interface MoveTaskInput {
  taskId: string;
  columnId: string;
  order: number;
}
