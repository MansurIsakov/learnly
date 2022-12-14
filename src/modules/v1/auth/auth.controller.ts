import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { User } from "../users/user.model";
import { IUserRequest } from "../../../types/interfaces/IUser";
import { AsyncMiddleware, backResponse } from "../../../types";
import { TokensErrorCode, UserErrorCode } from "../../../types/errors";
import { logger } from "@common/lib";
import { addCoreModules } from "../users/users.controller";

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
  req: Request,
  res: Response
): void => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: jwtExpires(),
    httpOnly: true,
    secure: req.secure,
  });

  res.locals.user = user;
  res.locals.role = user.role;

  // Remove password from output
  user.password = undefined;

  backResponse.ok(res, { token, user });
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { firstName, lastName, email, level } = req.body;

    firstName = firstName?.trim();
    lastName = lastName?.trim();
    email = email?.trim();

    /** Validate email */
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return backResponse.clientError(res, {
        message: "Email number must be provided",
        code: UserErrorCode.INVALID_EMAIL_PASSWORD,
      });
    }

    /** Validate firstName */
    if (!firstName) {
      return backResponse.clientError(res, {
        message: "First name must be provided",
        code: UserErrorCode.INVALID_FIRST_NAME,
      });
    }

    if (level <= 3 || level > 6) {
      return backResponse.clientError(res, {
        message: "Level must be between 3 and 6",
        code: UserErrorCode.INVALID_LEVEL,
      });
    }

    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      course: req.body.course,
      level: req.body.level,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, req, res);
  } catch (error: any) {
    if (error.code === 11000) {
      return backResponse.clientError(res, {
        message: "This email is already registered",
        code: UserErrorCode.EMAIL_ALREADY_EXISTS,
      });
    }

    next(error);
  }
};

export const login = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return backResponse.clientError(res, {
        message: "Please provide email and password!",
        code: UserErrorCode.INVALID_EMAIL_PASSWORD,
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password, user.password))) {
      return backResponse.clientError(res, {
        message: "Incorrect email or password",
        code: UserErrorCode.INVALID_EMAIL_PASSWORD,
      });
    }
    createSendToken(user, req, res);
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  backResponse.ok(res, { message: "Logged out successfully" });
};

export const protect: AsyncMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      logger.info("[Auth] No authorization header found");
      return backResponse.unauthorized(res, {
        code: TokensErrorCode.INVALID_TOKEN,
      });
    }

    const split = authorization.split(" ");
    if (!authorization.startsWith("Bearer ") || split.length !== 2) {
      logger.info(`[Auth] Invalid authorization header: ${authorization}`);
      return backResponse.unauthorized(res, {
        code: TokensErrorCode.INVALID_TOKEN,
      });
    }

    let token = split[1];

    if (!token) {
      return backResponse.clientError(res, {
        message: "You are not logged in! Please log in to get access.",
        code: TokensErrorCode.INVALID_TOKEN,
      });
    }

    let user;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return backResponse.clientError(res, {
        message: "The user belonging to this token does no longer exist.",
        code: UserErrorCode.USER_NOT_FOUND,
      });
    }
    user = currentUser;

    res.locals = {
      user: user,
      token: decoded,
    };

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return backResponse.clientError(res, {
        message: "Invalid token. Please log in again!",
        code: TokensErrorCode.JSON_WEB_TOKEN_ERROR,
      });
    }

    next(error);
  }
};
