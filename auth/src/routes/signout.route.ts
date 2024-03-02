import { Router, Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { SignoutController } from "../controllers/Signout.controller";

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

  const signoutController = Container.get(SignoutController);

  route.post(
    "/signout",
    async (req: Request, res: Response, next: NextFunction) => {
      signoutController.signout(req, res, next);
    }
  );
};
