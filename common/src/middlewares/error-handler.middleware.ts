import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/BaseError";
import Logger from "../utils/Logger";

const logger = Logger.getInstance();

/**
 * Middleware to handle a 422 Unprocessable Entity error (validation error).
 * If the provided error has a name of "ValidationError", it logs the error, constructs an appropriate response with a status code of 422,
 * and sends it as a JSON response to the client.
 * Otherwise, it passes the error to the next middleware or error handler.
 *
 * @param err - The error object.
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @param next - The callback function to invoke to pass control to the next middleware or error handler.
 * @returns If the error is a validation error, the function sends a JSON response and ends the response. Otherwise, it passes the error to the next middleware or error handler.
 */
const handle422Error = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the error is a validation error
  if (err.name === "ValidationError") {
    logger.error(`Error inside handle422Error middleware:, ${err}`);
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
  // Pass the error to the next middleware or error handler
  return next(err);
};

/**
 * Middleware to handle a 404 Not Found error.
 * If the provided error has a name of "Not found", it logs the error, constructs an appropriate response with a status code of 404,
 * and sends it as a JSON response to the client.
 * Otherwise, it passes the error to the next middleware or error handler.
 *
 * @param err - The error object.
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @param next - The callback function to invoke to pass control to the next middleware or error handler.
 * @returns If the error is a Not Found error, the function sends a JSON response and ends the response. Otherwise, it passes the error to the next middleware or error handler.
 */
const handle404Error = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the error is a Not Found error
  if (err.name === "Not found") {
    logger.error(`Error inside handle404Error middleware:, ${err}`);
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
  // Pass the error to the next middleware or error handler
  return next(err);
};

/**
 * Middleware to handle generic errors.
 * It logs the provided error, sets the appropriate status code on the response, and sends an error response as JSON to the client.
 *
 * @param err - The error object.
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @param next - The callback function to invoke to pass control to the next middleware or error handler.
 * @returns This function does not have a return value.
 */
const handleError = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error inside handleError middleware:, ${err}`);
  // Set the appropriate status code on the response
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
