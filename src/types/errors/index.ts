export abstract class AbstractError<T = ErrorEntity, JSON = T> extends Error {
  public data: Partial<T>;

  constructor(error: Partial<T>) {
    super();
    this.data = error;
  }

  public abstract toJSON(): JSON;
}

export enum RegistrationErrorCode {
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
}

export enum TokensErrorCode {
  INVALID_TOKEN = "INVALID_TOKEN",
  JSON_WEB_TOKEN_ERROR = "JSON_WEB_TOKEN_ERROR",
}

export enum UserErrorCode {
  USER_NOT_FOUND = "USER_NOT_FOUND",

  IVALID_USER_ID = "IVALID_USER_ID",
  INVALID_EMAIL_PASSWORD = "INVALID_EMAIL_PASSWORD",
  INVALID_FIRST_NAME = "INVALID_FIRST_NAME",
  INVALID_LAST_NAME = "INVALID_LAST_NAME",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  USER_MAX_CREDITS = "USER_MAX_CREDITS",
  USER_NO_CREDITS = "USER_NO_CREDITS",
  USER_ADD_CORE_MODULE = "USER_ADD_CORE_MODULE",
  INVALID_LEVEL = "INVALID_LEVEL",
  USER_ADD_DIFFERENT_LEVEL_MODULE = "USER_ADD_DIFFERENT_LEVEL_MODULE",
  USER_ADD_DIFFERENT_COURSE_MODULE = "USER_ADD_DIFFERENT_COURSE_MODULE",
  USER_ALREADY_HAS_MODULE = "USER_ALREADY_HAS_MODULE",
  USER_NO_MODULES = "USER_NO_MODULES",
  USER_REMOVE_CORE_MODULE = "USER_REMOVE_CORE_MODULE",
  USER_ALREADY_HAS_MODULES = "USER_ALREADY_HAS_MODULES",
  USER_DOES_NOT_HAVE_MODULE = "USER_DOES_NOT_HAVE_MODULE",
}

export enum ModuleErrorCode {
  MODULE_NOT_FOUND = "MODULE_NOT_FOUND",
}

export enum ScheduleErrorCode {
  SCHEDULE_NOT_FOUND = "SCHEDULE_NOT_FOUND",
  SCHEDULE_ALREADY_EXISTS = "SCHEDULE_ALREADY_EXISTS",
  NO_CLASSES_FOUND = "NO_CLASSES_FOUND",
  CLASS_COLLISION = "CLASS_COLLISION",
  INVALID_DATE = "INVALID_DATE",
}

export enum DocumentCode {
  DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND",
  DOCUMENT_ALREADY_EXISTS = "DOCUMENT_ALREADY_EXISTS",
}

export type errorResponse = {
  statusCode: number;
  message: string;
};

type AuthErrorCode = RegistrationErrorCode | TokensErrorCode;

type ErrorCode = AuthErrorCode;

export type ErrorEntity = {
  message?: string;
  status?: number;
  code?: ErrorCode;
  stack?: string;
  name?: string;
};
