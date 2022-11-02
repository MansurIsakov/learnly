import { UserDocument } from "@modules/v1/users/user.model";
import { Token } from "@type";
import { Response as ExpressResponse } from "express";

export type Res<Body = any, Locals = ResLocals> = ExpressResponse<Body, Locals>;

export type ResLocals<T = BaseResLocals> = T;

export type BaseResLocals<U = ResLocalsUser, T = Token> = {
  user: U;
  token: T;
};

export type ResLocalsUser = Pick<
  UserDocument,
  "status" | "username" | "phoneNumber" | "roles"
> &
  PickReplaceKey<UserDocument, { id: "userId" }>;
