import httpStatusCodes from "./httpStatusCodes";
import { BaseError } from "./BaseError";

export class Api429Error extends BaseError {
  constructor(
    name: string,
    statusCode = httpStatusCodes.TOO_MANY_REQUESTS,
    description = "Too many requests.",
    isOperational = true,
  ) {
    super(name, statusCode, isOperational, description);
  }
}
