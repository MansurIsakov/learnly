import { ClientErrorException } from "@common/utils/appError";
import { backResponse, UserErrorCode, ExamErrorCode } from "@type";
import { Controller } from "@type/controller";
import { Request, Response, NextFunction } from "express";
import { User } from "../users/user.model";
import { Exam } from "./exams.model";
import mongoose from "mongoose";

export const getExams: Controller = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const user: any = await User.findById(res.locals.user.id);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    let exam = await Exam.findOne({ owner: user.id });

    if (!exam) {
      exam = await Exam.create({ owner: user.id });
    }

    backResponse.ok(res, { results: exam.exams });
  } catch (error: any) {
    throw new ClientErrorException({
      message: "Failed to find schedule",
    });
  }
};

export const addExam: Controller = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const user: any = await User.findById(res.locals.user.id);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    let exam = await Exam.findOne({ owner: user.id });

    if (!exam) {
      exam = await Exam.create({ owner: user.id });
    }

    const examId = new mongoose.Types.ObjectId();

    exam.exams.push({
      id: examId,
      ...req.body,
    });

    await exam.save();

    backResponse.created(res, { results: exam.exams });
  } catch (error: any) {
    throw new ClientErrorException({
      message: "Failed to add exam",
    });
  }
};

export const updateExam: Controller = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const user: any = await User.findById(res.locals.user.id);
    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }
    const exam = await Exam.findOne({ owner: user.id });

    if (!exam) {
      return backResponse.clientError(res, {
        message: "No exam found with that ID",
        code: ExamErrorCode.EXAM_NOT_FOUND,
      });
    }

    const examIndex = exam.exams.findIndex(
      (exam: any) => exam.id == req.params.id
    );

    if (examIndex === -1) {
      return backResponse.clientError(res, {
        message: "No exam found with that ID",
        code: ExamErrorCode.EXAM_NOT_FOUND,
      });
    }

    exam.exams[examIndex] = {
      id: exam.exams[examIndex].id,
      ...req.body,
    };

    await exam.save();

    backResponse.ok(res, { results: exam.exams });
  } catch (error: any) {
    throw new ClientErrorException({
      message: "Failed to add exam",
    });
  }
};

export const deleteExam: Controller = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  try {
    const user: any = await User.findById(res.locals.user.id);

    if (!user) {
      return backResponse.clientError(res, {
        message: "No user found with that ID",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }

    const exam = await Exam.findOne({ owner: user.id });

    if (!exam) {
      return backResponse.clientError(res, {
        message: "No exam found with that ID",
        code: ExamErrorCode.EXAM_NOT_FOUND,
      });
    }

    const examId = req.params.id;

    const isExamIdValid = exam.exams.some((exam: any) => exam.id == examId);

    if (!isExamIdValid) {
      return backResponse.clientError(res, {
        message: "No exam found with that ID",
        code: ExamErrorCode.EXAM_NOT_FOUND,
      });
    }

    exam.exams = exam.exams.filter((exam: any) => exam.id != examId);

    if (!exam) {
      return backResponse.clientError(res, {
        message: "No exam found with that ID",
        code: ExamErrorCode.EXAM_NOT_FOUND,
      });
    }

    await exam.save();

    backResponse.deleted(res);
  } catch (error: any) {
    throw new ClientErrorException({
      message: "Failed to find schedule",
    });
  }
};
