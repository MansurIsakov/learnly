import { Response as EResponse } from "express";

export const backResponse = {
  jsonRes: <T>(
    res: EResponse,
    status: number,
    body?: ResponseBody<T>,
    defaultMessage?: string
  ) => {
    if (body) {
      res.status(status).json({
        message: body.message ?? defaultMessage,
        data: body.data ?? undefined,
        code: body.code ?? undefined,
        ...body,
      });
    } else {
      res.sendStatus(status);
    }
  },

  tokens: (res: EResponse, token: string) => {
    res.status(200).json({
      token,
    });
  },

  ok: <T>(res: EResponse, body?: ResponseBody<T>) => {
    backResponse.jsonRes<T>(res, 200, body);
  },

  created: <T>(res: EResponse, body?: ResponseBody<T>) => {
    backResponse.jsonRes<T>(res, 201, body);
  },

  clientError: <T>(res: EResponse, body?: ResponseBody<T>) => {
    backResponse.jsonRes(res, 400, body);
  },

  unauthorized: <T>(res: EResponse, body?: ResponseBody<T>) => {
    backResponse.jsonRes(res, 401, body);
  },

  paymentRequired: <T>(res: EResponse, body?: ResponseBody<T>) => {
    return backResponse.jsonRes(res, 402, body, "Payment required");
  },

  forbidden: <T>(res: EResponse, body?: ResponseBody<T>) => {
    return backResponse.jsonRes(res, 403, body, "Forbidden");
  },

  notFound: <T>(res: EResponse, body?: ResponseBody<T>) => {
    return backResponse.jsonRes(res, 404, body, "Not found");
  },

  conflict: <T>(res: EResponse, body?: ResponseBody<T>) => {
    return backResponse.jsonRes(res, 409, body, "Conflict");
  },

  tooMany: <T>(res: EResponse, body?: ResponseBody<T>) => {
    return backResponse.jsonRes(res, 429, body, "Too many requests");
  },

  todo: (res: EResponse) => {
    return backResponse.jsonRes(res, 400, { message: "TODO" });
  },

  error: <T>(
    res: EResponse,
    status: number = 500,
    body?: ResponseBody<T> | Error
  ) => {
    if (body instanceof Error || status >= 500) {
      console.log(
        `[UNEXPECTED ERROR] ${
          body instanceof Error
            ? body.toString()
            : body?.message ?? "Unknown error"
        }:\n${body?.stack ?? " - "}`
      );
      return backResponse.jsonRes(res, status, {
        message: "Internal server error",
      });
    }

    console.log(`[Client Error] ${body?.message ?? "Unknown error"}`);
    return backResponse.jsonRes(res, status, {
      message: body?.message,
      code: body?.code,
    });
  },
};

type ResponseBody<T = any> = {
  data?: T;
  message?: string;
  code?: any;
} & Record<string, any>;
