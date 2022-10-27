export abstract class AbstractError<T = ErrorEntity, JSON = T> extends Error {
  public data: Partial<T>;

  constructor(error: Partial<T>) {
    super();
    this.data = error;
  }

  public abstract toJSON(): JSON;
}

export enum RegistrationErrorCode {
  PHONE_NUMBER_ALREADY_EXISTS = "PHONE_NUMBER_ALREADY_EXISTS",
  USERNAME_ALREADY_EXISTS = "USERNAME_ALREADY_EXISTS",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
}

export enum TokensErrorCode {
  INVALID_TOKEN = "INVALID_TOKEN",
}

export enum UserErrorCode {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  MASTER_NOT_FOUND = "MASTER_NOT_FOUND",

  IVALID_USER_ID = "IVALID_USER_ID",
  INVALID_USERNAME = "INVALID_USERNAME",
  INVALID_EMAIL_PASSWORD = "INVALID_EMAIL_PASSWORD",
  INVALID_PHONE_NUMBER = "INVALID_PHONE_NUMBER",
  INVALID_FIRST_NAME = "INVALID_FIRST_NAME",
  INVALID_LAST_NAME = "INVALID_LAST_NAME",
  INVALID_TAGS = "INVALID_TAGS",
  INVALID_ADDRESS = "INVALID_ADDRESS",
  INVALID_SOCIALS = "INVALID_SOCIALS",
  INVALID_PREFERED_LANGUAGES = "INVALID_PREFERED_LANGUAGES",
  INVALID_GENDER = "INVALID_GENDER",

  USERNAME_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  PHONE_NUMBER_ALREADY_EXISTS = "PHONE_NUMBER_ALREADY_EXISTS",
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
