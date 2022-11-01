import { Request } from "express";

export type Req<Body = any, Query extends string = never> = Request<
  ReqParams,
  any,
  ReqBody<Body>,
  ReqQuery<Query>
>;

export type PagingReq<Body = any, Query extends string = string> = Request<
  ReqParams,
  any,
  ReqBody<Body>,
  PagingQuery<Query>
>;

/** Request Params*/
export type ReqParams = Record<string, string>;

/** Request Body */
export type ReqBody<T> = Partial<T>;

/** Request Query */
export type ReqQuery<T extends string = never> = Record<
  T,
  string | string[] | undefined | qs.ParsedQs
> &
  qs.ParsedQs;

export type PagingQuery<T extends string = never> = Record<
  "offset" | "limit",
  string
> &
  Record<T, qs.ParsedQs> &
  qs.ParsedQs;
