export enum RegistrationErrorCode {
  PHONE_NUMBER_ALREADY_EXISTS = "PHONE_NUMBER_ALREADY_EXISTS",
  USERNAME_ALREADY_EXISTS = "USERNAME_ALREADY_EXISTS",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
}

export enum TokensErrorCode {
  INVALID_ACCESS_TOKEN = "INVALID_ACCESS_TOKEN",
  INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN",
}

export type errorResponse = {
  statusCode: number;
  message: string;
};

type AuthErrorCode = RegistrationErrorCode | TokensErrorCode;
