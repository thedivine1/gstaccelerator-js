export class GSTAcceleratorError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public responseBody: Record<string, unknown>
  ) {
    super(message);
    this.name = 'GSTAcceleratorError';
  }
}

export class AuthenticationError extends GSTAcceleratorError {
  constructor(message: string, statusCode: number, responseBody: Record<string, unknown>) {
    super(message, statusCode, responseBody);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends GSTAcceleratorError {
  public retryAfter?: number;
  
  constructor(message: string, statusCode: number, responseBody: Record<string, unknown>, retryAfter?: number) {
    super(message, statusCode, responseBody);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class NotFoundError extends GSTAcceleratorError {
  constructor(message: string, statusCode: number, responseBody: Record<string, unknown>) {
    super(message, statusCode, responseBody);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends GSTAcceleratorError {
  constructor(message: string, statusCode: number, responseBody: Record<string, unknown>) {
    super(message, statusCode, responseBody);
    this.name = 'ValidationError';
  }
}

export class ServerError extends GSTAcceleratorError {
  constructor(message: string, statusCode: number, responseBody: Record<string, unknown>) {
    super(message, statusCode, responseBody);
    this.name = 'ServerError';
  }
}
