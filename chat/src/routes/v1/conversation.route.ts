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
    "/conversations",
    route,
    function (req: Request, res: Response, next: NextFunction) {
      req.body = MongoSanitize(req.body);
      next();
    }
  );

  const conversationController = Container.get(ConversationController);

  route.post("/", async (req: Request, res: Response, next: NextFunction) => {
    await conversationController.create(req, res, next);
  });

  route.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    await conversationController.getById(req, res, next);
  });

  route.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    await conversationController.updateById(req, res, next);
  });

  route.post("/:id/participants", async (req: Request, res: Response, next: NextFunction) => {
    await conversationController.addParticipantsToConversation(req, res, next);
  });

  route.delete("/:conversation_id/participants/:user_id", async (req: Request, res: Response, next: NextFunction) => {
    await conversationController.removeParticipantFromConversation(req, res, next);
  });

  route.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    await conversationController.deleteById(req, res, next);
  });
};
