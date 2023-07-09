import httpStatusCodes from "./httpStatusCodes";
import { BaseError } from "./BaseError";

export class Api401Error extends BaseError {
  constructor(
    name: string,
    statusCode = httpStatusCodes.UNAUTHORISED,
    description = "Unauthorised.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}
