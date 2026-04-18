import { HydratedDocument, Model, Schema, model } from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
type UserModel = Model<User>;

const userSchema = new Schema<User, UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = model<User, UserModel>("User", userSchema);
