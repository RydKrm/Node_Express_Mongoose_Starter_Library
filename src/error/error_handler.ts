import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

interface ErrorInterface {
  status?: number;
  message?: string;
  name?: string;
  errors?: any;
}

exports.error_handler = (
  err: ErrorInterface,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorData: ErrorInterface = {};
  if (err.status) {
    errorData.status = err.status;
  }
  if (err.message) {
    errorData.message = err.message;
  }
  if (err.name === "CastError") {
    errorData.status = 400;
    errorData.message = `Object id is invalid`;
  }
  if (err.name === "ValidationError") {
    errorData.status = 422;
    errorData.message = Object.values(err.errors)
      .map((val: any) => val.message)
      .toString();
  }
  const newErrorResponse = createError(
    errorData.status || 500,
    errorData.message || "Internal server error"
  );
  return res.status(newErrorResponse.status).json({
    success: false,
    message: newErrorResponse.message,
  });
};
