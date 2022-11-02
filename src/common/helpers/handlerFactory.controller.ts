import { Request, Response, NextFunction } from "express";
import APIFeatures from "../utils/apiFeatures";
import { backResponse } from "../../types";
import { ClientErrorException } from "@common/utils/appError";
import { logger } from "@common/lib";
import { Controller } from "@type/controller";

// GET *
export const getAll =
  (Model: any): Controller =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const doc = await features.query;

      backResponse.ok(res, { results: doc, count: doc.length });
    } catch (error) {
      throw new ClientErrorException({
        message: "Failed to load all users",
      });
    }
  };

// GET
export const getOne =
  (Model: any, populateOptions?: any): Controller =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query = await Model.findById(req.params.id);
      if (populateOptions) query = query.populate(populateOptions);

      const doc = await query;

      if (!doc) {
        return backResponse.clientError(res, {
          message: `No ${doc} found with that ID`,
          code: 404,
        });
      }

      backResponse.ok(res, { results: doc });
    } catch (error) {
      throw new ClientErrorException({
        message: "Failed to find user",
      });
    }
  };

// UPDATE
export const updateOne = (Model: any): Controller => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return backResponse.clientError(res, {
          message: `No ${doc} found with that ID`,
          code: 404,
        });
      }

      backResponse.ok(res, { results: doc });
    } catch (error) {
      logger.error(error);
      throw new ClientErrorException({ message: "Failed to update user" });
    }
  };
};

// DELETE
export const deleteOne = (Model: any): Controller => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return backResponse.clientError(res, {
          message: `No ${doc} found with that ID`,
          code: 404,
        });
      }

      backResponse.deleted(res);
    } catch (error) {
      throw new ClientErrorException({ message: "Failed to delete user" });
    }
  };
};

// CREATE
export const createOne = (Model: any): Controller => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.create(req.body);

      backResponse.created(res, { results: doc });
    } catch (error) {
      throw new ClientErrorException({ message: "Failed to create user" });
    }
  };
};
