import { Types } from "mongoose";

import { ProjectDocument, ProjectModel } from "../models/project.model";

interface CreateProjectInput {
  ownerId: Types.ObjectId;
  name: string;
  description?: string;
}

class ProjectRepository {
  async create(payload: CreateProjectInput): Promise<ProjectDocument> {
    return ProjectModel.create(payload);
  }

  async findByOwner(ownerId: string): Promise<ProjectDocument[]> {
    return ProjectModel.find({ ownerId }).sort({ updatedAt: -1 }).exec();
  }

  async findByIdAndOwner(projectId: string, ownerId: string): Promise<ProjectDocument | null> {
    return ProjectModel.findOne({ _id: projectId, ownerId }).exec();
  }

  async existsByOwnerAndName(ownerId: string, name: string): Promise<boolean> {
    const project = await ProjectModel.exists({ ownerId, name });
    return Boolean(project);
  }
}

export const projectRepository = new ProjectRepository();
