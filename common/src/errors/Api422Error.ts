import httpStatusCodes from "./httpStatusCodes";
import { BaseError } from "./BaseError";

export class Api422Error extends BaseError {
  constructor(
    name: string,
    statusCode = httpStatusCodes.UNPROCESSABLE_ENTITY,
    description = "Unprocessable entity.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}
