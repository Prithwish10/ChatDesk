import httpStatusCodes from "./httpStatusCodes";
import { BaseError } from "./BaseError";

export class Api409Error extends BaseError {
  constructor(
    name: string,
    statusCode = httpStatusCodes.CONFLICT,
    description = "Record already exist.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}
