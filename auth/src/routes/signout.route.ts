import "reflect-metadata";
import { Router, Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { SignoutController } from "../controllers/Signout.controller";

const route = Router();

export default (app: Router) => {
  function MongoSanitize(data: any) {
    return sanitize(data);
  }

  /**
   * Express Middleware for Sanitizing MongoDB Query Parameters
   *
   * This middleware is designed to be used with Express applications to sanitize
   * the request body for requests targeting the "/users" endpoint. It helps prevent
   * NoSQL injection attacks by removing any potentially harmful MongoDB operators
   * from the request body before passing it to the next middleware or route handler.
   *
   * @param {Request} req - The Express request object containing information about the incoming HTTP request.
   * @param {Response} res - The Express response object used to send the response back to the client.
   * @param {NextFunction} next - The callback function to proceed to the next middleware or route handler.
   *
   * @throws {Error} If the `MongoSanitize` function is not properly implemented or loaded.
   **/
  app.use(
    "/users",
    route,
    function (req: Request, res: Response, next: NextFunction) {
      req.body = MongoSanitize(req.body);
      next();
    }
  );

  const signoutController = Container.get(SignoutController);

  /**
   * POST User Signout Route
   *
   * This route handler is designed to handle POST requests to the "/signout" endpoint.
   * It is responsible for signing out the user by clearing the session.
   *
   * @param {Request} req - The Express Request object representing the HTTP request.
   * @param {Response} res - The Express Response object representing the HTTP response.
   * @param {NextFunction} next - The Express NextFunction middleware for passing control to the next middleware.
   * @returns {Promise<void>} - A Promise indicating the completion of the operation.
   */
  route.post(
    "/signout",
    async (req: Request, res: Response, next: NextFunction) => {
      signoutController.signout(req, res, next);
    }
  );
};
