import httpStatusCodes from "./httpStatusCodes";
import { BaseError } from "./BaseError";

export class Api403Error extends BaseError {
  constructor(
    name: string,
    statusCode = httpStatusCodes.FORBIDDEN,
    description = "Forbidden.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}
