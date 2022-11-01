import { NextFunction, Request, Response as EResponse } from "express";
import { backResponse, AbstractError } from "@type";
import { logger } from "@lib/logger";

const errorHandler = (
  error: any,
  _req: Request,
  res: EResponse,
  next: NextFunction
) => {
  try {
    if (error instanceof AbstractError) {
      const { status } = error.data;
      return backResponse.error(res, status, error.data);
    }

    const { status, message } = error;
    logger.crit(`[UNEXPECTED ERROR] ${message}:\n${error.stack}`);
    backResponse.error(res, status || 500, {});
  } catch (error) {
    next(error);
  }
};

export default errorHandler;
