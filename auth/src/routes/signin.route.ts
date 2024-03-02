import { Router, Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { SignInController } from "../controllers/Signin.controller";

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

  const signinController = Container.get(SignInController);

  route.post(
    "/signin",
    async (req: Request, res: Response, next: NextFunction) => {
      await signinController.signin(req, res, next);
    }
  );
};
