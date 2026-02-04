class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public originalError?: Error;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    originalError?: Error 
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.originalError = originalError;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
