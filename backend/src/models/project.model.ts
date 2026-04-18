import { HydratedDocument, Model, Schema, Types, model } from "mongoose";

export interface Project {
  ownerId: Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectDocument = HydratedDocument<Project>;
type ProjectModel = Model<Project>;

const projectSchema = new Schema<Project, ProjectModel>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

projectSchema.index({ ownerId: 1, name: 1 }, { unique: true });

export const ProjectModel = model<Project, ProjectModel>("Project", projectSchema);
