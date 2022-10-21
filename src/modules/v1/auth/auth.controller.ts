import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import catchAsync from "../../../utils/catchAsync";
import AppError from "../../../utils/appError";
import { success } from "../../../utils/apiResponse";
import { User } from "../users/user.model";
import { IUserRequest } from "../../../types/interfaces/IUser";

const jwtExpires = () =>
  new Date(
    Date.now() + (Number(process.env.JWT_EXPIRES_IN_MS) ?? 60 * 60 * 1000)
  );

const signToken = (id: string) => {
  return jwt.sign({ id }, String(process.env.JWT_SECRET), {
    expiresIn: jwtExpires().getTime(),
  });
};

const createSendToken = (
  user: {
    _id: string;
    role: string;
    password: string | undefined;
  },
  statusCode: number,
  req: Request,
  res: Response
): void => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: jwtExpires(),
    httpOnly: true,
    secure: req.secure,
  });

  res.locals.role = user.role;

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      course: req.body.course,
      level: req.body.level,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(newUser, 201, req, res);
  }
);

export const login = catchAsync(
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    createSendToken(user, 200, req, res);
  }
);

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json(success("success", 200));
};

export const protect = catchAsync(
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    let user = req.user;

    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access", 401)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token does not exist!", 401)
      );
    }

    user = currentUser;
    req.user = currentUser;
    next();
  }
);
