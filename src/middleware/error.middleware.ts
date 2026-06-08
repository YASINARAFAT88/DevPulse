import { Request, Response, NextFunction } from "express";
import AppError from "../utils/App.Error";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if ("code" in err) {
    const pgError = err as Error & { code?: string };

    // PostgreSQL unique violation
    if (pgError.code === "23505") {
      statusCode = 400;
      message = "Duplicate resource";
    }
  } else {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.message,
  });
};

export default globalErrorHandler;