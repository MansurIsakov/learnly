import {
  getAll,
  updateOne,
  deleteOne,
} from "../../../common/helpers/handlerFactory.controller";
import { Request, Response, NextFunction } from "express";

import { User } from "./user.model";
import { backResponse } from "../../../types";
import { UserErrorCode } from "../../../types/errors";
import { ClientErrorException } from "@common/utils/appError";

export const getAllUsers = getAll(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);

// GET User
export const getUser = async (req: Request, res: Response, _: NextFunction) => {
  try {
    let doc = await User.findById(req.params.id).populate("schedule");

    if (!doc) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }
    backResponse.ok(res, { results: doc });
  } catch (error) {
    throw new ClientErrorException({
      message: "Failed to find user",
    });
  }
};
