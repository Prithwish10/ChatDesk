import { Router, Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { currentUser, requireAuth } from "@pdchat/common";
import { ConversationController } from "../../controllers/v1/Conversation.controller";

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

  const conversationController = Container.get(ConversationController);

  /**
   * Get User Conversations Route
   *
   * This route handler is designed to handle GET requests to the "/:id/conversations" endpoint.
   * It retrieves conversations for the specified user ID, subject to authentication and authorization checks.
   *
   * @param {Request} req - The Express request object containing information about the incoming HTTP request.
   * @param {Response} res - The Express response object used to send the response back to the client.
   * @param {NextFunction} next - The callback function to proceed to the next middleware or route handler.
   *
   * @throws {Error} If the current user information is not available in the `currentUser` middleware.
   * @throws {Error} If the user is not authenticated, and `requireAuth` middleware denies access.
   * @throws {Error} If there's an error during the retrieval of user conversations from the `conversationController`.
   *
   **/
  route.get(
    "/:id/conversations",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await conversationController.getUserConversations(req, res, next);
    }
  );
};
