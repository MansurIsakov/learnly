import {
  getAll,
  updateOne,
  deleteOne,
} from "../../../common/helpers/handlerFactory.controller";
import { Request, Response, NextFunction } from "express";
import { success, error } from "../../../common/utils/apiResponse";

import catchAsync from "../../../common/utils/catchAsync";
import { User } from "./user.model";
import { backResponse } from "../../../types";
import { UserErrorCode } from "../../../types/errors";

export const getAllUsers = getAll(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);

// GET 1
export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let doc = await User.findById(req.params.id).populate("schedule");

    if (!doc) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    res.status(200).json(success("success", 200, doc));
  }
);

// Unhandled Router
export const createUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json(error("This route is not defined! Please use /singup instead.", 500));
};
