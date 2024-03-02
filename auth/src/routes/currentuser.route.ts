import { Router, Request, Response, NextFunction } from "express";
import { currentUser, requireAuth } from "@pdchat/common";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { UserController } from "../controllers/User.controller";

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

  const userController = Container.get(UserController);

  route.get(
    "/currentuser",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await userController.currentUser(req, res, next);
    }
  );
};
