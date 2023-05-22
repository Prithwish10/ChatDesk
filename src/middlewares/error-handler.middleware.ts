import { Request, Response, NextFunction } from "express";
import { BaseError } from "../utils/error-handlers/BaseError"

const handle422Error = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "ValidationError") {
    return res
      .status(422)
      .json({
        errors: {
          success: false,
          message: err.message,
          statuscode: 422,
        },
      })
      .end();
  }
  return next(err);
};

const handle404Error = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "Not found") {
    console.log("Inside 404 => ", err.name);
    return res
      .status(404)
      .json({
        errors: {
          success: false,
          message: err.message,
          description: err.name,
          statuscode: 404,
        },
      })
      .end();
  }
  return next(err);
};

const handleError = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || 500);
  res.json({
    errors: {
      success: false,
      message: err.message,
      description: err.name,
      statuscode: err.statusCode,
    },
  });
};

export { handle422Error, handleError, handle404Error };