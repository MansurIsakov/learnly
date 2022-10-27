import { AbstractError, ErrorEntity } from "../../types/errors";

/**
 * Custom error class for handling errors
 */
export class HttpError extends AbstractError<ErrorEntity> {
  public toJSON(): ErrorEntity {
    return {
      ...this.data,
      code: this.data.code,
      message: this.data.message,
      status: this.data.status,
    };
  }
}

/**
 * Client side error exception
 * @status 400
 */
export class ClientErrorException extends HttpError {
  constructor(data?: ErrorEntity) {
    super({
      ...data,
      status: 400,
    });
  }
}

/**
 * Unauthorized error exception
 * @status 401
 */

export class UnauthorizedException extends HttpError {
  constructor(data?: ErrorEntity) {
    super({
      ...data,
      status: 401,
    });
  }
}

/**
 * Payment required error exception
 * @status 402
 */
export class PaymentRequiredException extends HttpError {
  constructor(data?: ErrorEntity) {
    super({
      ...data,
      status: 402,
    });
  }
}

/**
 * Forbidden error exception
 * @status 403
 */
export class ForbiddenException extends HttpError {
  constructor(data?: ErrorEntity) {
    super({
      ...data,
      status: 403,
    });
  }
}

/**
 * Not found error exception
 * @status 404
 */
export class NotFoundException extends HttpError {
  constructor(data?: ErrorEntity) {
    super({
      ...data,
      status: 404,
    });
  }
}

/**
 * Server side error exception
 * @status 500
 */
export class ServerErrorException extends HttpError {
  constructor(data?: ErrorEntity) {
    super({
      ...data,
      status: 500,
    });
  }
}
