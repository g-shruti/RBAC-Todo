import { UserDocument, UserModel } from "../models/user.model";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

class UserRepository {
  async create(payload: CreateUserInput): Promise<UserDocument> {
    return UserModel.create(payload);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).select("+password").exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).exec();
  }
}

export const userRepository = new UserRepository();
