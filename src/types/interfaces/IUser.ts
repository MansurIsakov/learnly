import { Request } from "express";

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  emoji?: string;
  dob?: string;
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
