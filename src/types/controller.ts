import { Req, AsyncMiddleware } from "./middleware";
import { Response } from "express";

export type Controller<
  CReq extends Req<any, never> = Req,
  CRes = Response,
  Return = any
> = AsyncMiddleware<CReq, CRes, Return>;
