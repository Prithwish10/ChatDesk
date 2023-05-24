import { Router, Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { MessageController } from "../../controllers/v1/Message.controller";

const route = Router();

export default (app: Router) => {
  function MongoSanitize(data: any) {
    return sanitize(data);
  }

  app.use(
    "/messages",
    route,
    function (req: Request, res: Response, next: NextFunction) {
      req.body = MongoSanitize(req.body);
      next();
    }
  );

  const messageController = Container.get(MessageController);

  route.post("/", async (req: Request, res: Response, next: NextFunction) => {
    await messageController.create(req, res, next);
  });

  route.get("/", async (req: Request, res: Response, next: NextFunction) => {
    await messageController.get(req, res, next);
  });

  route.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    await messageController.getById(req, res, next);
  });

  route.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    await messageController.updateById(req, res, next);
  });

  route.delete("/", async (req: Request, res: Response, next: NextFunction) => {
    await messageController.deleteById(req, res, next);
  });
};
