export class ApiError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFound(message: string): ApiError {
  return new ApiError(404, message);
}

export function badRequest(message: string): ApiError {
  return new ApiError(400, message);
}

export function forbidden(message: string): ApiError {
  return new ApiError(403, message);
}
