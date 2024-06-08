import { Router, Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { currentUser, requireAuth } from "@pdchat/common";
import { ConversationController } from "../../controllers/v1/Conversation.controller";
import { MessageController } from "../../controllers/v1/Message.controller";

const route = Router();

export default (app: Router) => {
  function MongoSanitize(data: any) {
    return sanitize(data);
  }

  /**
   * Express Middleware for Sanitizing MongoDB Query Parameters
   *
   * This middleware is designed to be used with Express applications to sanitize
   * the request body for requests targeting the "/conversations" endpoint. It helps prevent
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
    "/conversations",
    route,
    function (req: Request, res: Response, next: NextFunction) {
      req.body = MongoSanitize(req.body);
      next();
    }
  );

  const conversationController = Container.get(ConversationController);
  const messageController = Container.get(MessageController);

  /**
   * Create Conversation Route
   *
   * This route handler is designed to handle POST requests to the "/conversations" endpoint.
   * It is responsible for creating a new conversation, subject to authentication and authorization checks.
   *
   * @param {Request} req - The Express request object containing information about the incoming HTTP request.
   * @param {Response} res - The Express response object used to send the response back to the client.
   * @param {NextFunction} next - The callback function to proceed to the next middleware or route handler.
   *
   * @throws {Error} If the current user information is not available in the `currentUser` middleware.
   * @throws {Error} If the user is not authenticated, and `requireAuth` middleware denies access.
   * @throws {Error} If there's an error during the conversation creation process in the `conversationController`.
   **/
  route.post(
    "/",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await conversationController.create(req, res, next);
    }
  );

  /**
   * Get Conversation by ID Route
   *
   * This route handler is designed to handle POST requests to the "/conversations/:id" endpoint.
   * It is responsible for creating a new conversation, subject to authentication and authorization checks.
   *
   * @param {Request} req - The Express request object containing information about the incoming HTTP request.
   * @param {Response} res - The Express response object used to send the response back to the client.
   * @param {NextFunction} next - The callback function to proceed to the next middleware or route handler.
   *
   * @throws {Error} If the current user information is not available in the `currentUser` middleware.
   * @throws {Error} If the user is not authenticated, and `requireAuth` middleware denies access.
   * @throws {Error} If there's an error during the conversation creation process in the `conversationController`.
   **/
  route.get(
    "/:id",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await conversationController.getById(req, res, next);
    }
  );

  /**
   * Update Conversation by ID Route
   *
   * This route handler is designed to handle PUT requests to the "/conversations/:id" endpoint.
   * It updates a specific conversation identified by its ID, subject to authentication and authorization checks.
   *
   * @param {Request} req - The Express request object containing information about the incoming HTTP request.
   * @param {Response} res - The Express response object used to send the response back to the client.
   * @param {NextFunction} next - The callback function to proceed to the next middleware or route handler.
   *
   * @throws {Error} If the current user information is not available in the `currentUser` middleware.
   * @throws {Error} If the user is not authenticated, and `requireAuth` middleware denies access.
   * @throws {Error} If there's an error during the conversation update process by ID in the `conversationController`.
   **/
  route.put(
    "/:id",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await conversationController.updateById(req, res, next);
    }
  );

  /**
   * Add Participants to Conversation Route
   *
   * This route handler is designed to handle PATCH requests to the "conversations/:id/participants" endpoint.
   * It adds participants to a conversation with the specified ID, subject to authentication and authorization checks.
   *
   * @param {Request} req - The Express request object containing information about the incoming HTTP request.
   * @param {Response} res - The Express response object used to send the response back to the client.
   * @param {NextFunction} next - The callback function to proceed to the next middleware or route handler.
   *
   * @throws {Error} If the current user information is not available in the `currentUser` middleware.
   * @throws {Error} If the user is not authenticated, and `requireAuth` middleware denies access.
   * @throws {Error} If there's an error during the process of adding participants in the `conversationController`.
   **/
  route.patch(
    "/:id/participants",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await conversationController.addParticipantsToConversation(
        req,
        res,
        next
      );
    }
  );

  /**
   * Remove Participant from Conversation Route
   *
   * This route handler is designed to handle PATCH requests to the "conversations/:conversation_id/participants/:user_id" endpoint.
   * It removes a specific participant with the given user ID from the conversation specified by conversation ID.
   * The route is subject to authentication and authorization checks.
   *
   * @param {Request} req - The Express request object containing information about the incoming HTTP request.
   * @param {Response} res - The Express response object used to send the response back to the client.
   * @param {NextFunction} next - The callback function to proceed to the next middleware or route handler.
   *
   * @throws {Error} If the current user information is not available in the `currentUser` middleware.
   * @throws {Error} If the user is not authenticated, and `requireAuth` middleware denies access.
   * @throws {Error} If there's an error during the process of removing a participant in the `conversationController`.
   **/
  route.patch(
    "/:conversation_id/participants/:user_id",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await conversationController.removeParticipantFromConversation(
        req,
        res,
        next
      );
    }
  );

  /**
   * Delete Conversation by ID Route
   *
   * This route handler is designed to handle DELETE requests to the "conversations/:id" endpoint.
   * It deletes a specific conversation identified by its ID, subject to authentication and authorization checks.
   *
   * @param {Request} req - The Express request object containing information about the incoming HTTP request.
   * @param {Response} res - The Express response object used to send the response back to the client.
   * @param {NextFunction} next - The callback function to proceed to the next middleware or route handler.
   *
   * @throws {Error} If the current user information is not available in the `currentUser` middleware.
   * @throws {Error} If the user is not authenticated, and `requireAuth` middleware denies access.
   * @throws {Error} If there's an error during the conversation deletion process by ID in the `conversationController`.
   **/
  route.delete(
    "/:id",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await conversationController.deleteById(req, res, next);
    }
  );

  /**
   * Get Conversation Messages Route
   *
   * This route handler is designed to handle GET requests to the "/conversations/:id/messages" endpoint.
   * It retrieves messages associated with a conversation, subject to authentication and authorization checks.
   *
   * @param {Request} req - The Express request object containing information about the incoming HTTP request.
   * @param {Response} res - The Express response object used to send the response back to the client.
   * @param {NextFunction} next - The callback function to proceed to the next middleware or route handler.
   *
   * @throws {Error} If the current user information is not available in the `currentUser` middleware.
   * @throws {Error} If the user is not authenticated, and `requireAuth` middleware denies access.
   * @throws {Error} If there's an error during the message retrieval process in the `messageController`.
   **/
  route.get(
    "/:id/messages",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await messageController.get(req, res, next);
    }
  );
};
