import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { success } from "../utils/apiResponse";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(success("success", 200));
  }
);
