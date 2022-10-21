/**
 * @desc    This file contain Success and Error response for sending to client / user
 **/

/**
 * @desc    Send any success response
 **/

export const success = (
  message: string,
  statusCode: number,
  results?: unknown,
  count?: number
) => {
  return {
    message,
    error: false,
    code: statusCode,
    count,
    results,
  };
};

/**
 * @desc    Send any error response
 **/

export const error = (message: string, statusCode: number) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];

  // Get matched code
  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    message,
    code: statusCode,
    error: true,
  };
};

/**
 * @desc    Send any validation response
 **/

export const validation = (errors: [object]) => {
  return {
    message: "Validation errors",
    error: true,
    code: 422,
    errors,
  };
};
