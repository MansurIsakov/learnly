import { Request } from "express";

export interface UserModule {
  moduleId: string;
  moduleName: string;
  type: string;
  courses: string[];
  moduleLevel: number;
  credits?: number;
}
export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: string;
  course: string;
  role: string;
  active: boolean;
  emoji?: string;
  dob?: string;
  status?: string[];
  modules: {
    moduleId: string;
    moduleName: string;
  }[];
  credits: number;
  schedule: string;
}

export interface IUserRequest extends Request {
  user: {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    active: boolean;
  };
}
