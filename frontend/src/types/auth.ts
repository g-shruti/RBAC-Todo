export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthPayload {
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}
