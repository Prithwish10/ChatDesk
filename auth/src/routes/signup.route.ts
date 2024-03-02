import { Router, Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { SignUpController } from "../controllers/Signup.controller";

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

  const signUpController = Container.get(SignUpController);

  route.post(
    "/signup",
    async (req: Request, res: Response, next: NextFunction) => {
      await signUpController.signup(req, res, next);
    }
  );
};
