import { Router, Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { ConversationController } from "../../controllers/v1/Conversation.controller";

const route = Router();

export default (app: Router) => {
  function MongoSanitize(data: any) {
    return sanitize(data);
  }

  app.use(
    "/users",
    route,
    function (req: Request, res: Response, next: NextFunction) {
      req.body = MongoSanitize(req.body);
      next();
    }
  );

  const conversationController = Container.get(ConversationController);

  route.get("/:id/conversations", async (req: Request, res: Response, next: NextFunction) => {
    await conversationController.getUserConversations(req, res, next);
  });
};
