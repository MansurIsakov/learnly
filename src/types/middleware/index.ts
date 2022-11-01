import { NextFunction, Response } from "express";

import { Req } from "./request";

export * from "./request";

/** */
export type Middleware<
  MReq extends Req = Req,
  MRes = Response,
  Return = any
> = (req: MReq, res: MRes, next: NextFunction) => Return;

/** */
export type AsyncMiddleware<
  MReq extends Req<any, never> = Req,
  MRes = Response,
  Return = any
> = Middleware<MReq, MRes, Promise<Return>>;
