import { Request, Response, NextFunction } from "express";
import { success } from "../utils/apiResponse";

import APIFeatures from "../utils/apiFeatures";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

// GET *
export const getAll = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json(success("success", 200, doc, doc.length));
  });

// GET 1
export const getOne = (Model: any, populateOptions?: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = await Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${doc} found with that ID`, 404));
    }

    res.status(200).json(success("success", 200, doc));
  });

// UPDATE 1
export const updateOne = (Model: any) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${doc} found with that ID`, 404));
    }

    res.status(200).json(success("success", 200, doc));
  });
};

// DELETE 1
export const deleteOne = (Model: any) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No ${doc} found with that ID`, 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};

// CREATE 1
export const createOne = (Model: any) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json(success("success", 201, doc));
  });
};
