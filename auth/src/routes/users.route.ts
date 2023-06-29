import { Router, Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { signUpValidation } from "../middlewares/validator";
import { SignUpController } from "../controllers/signup.controller";

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

  route.get(
    "/currentuser",
    async (req: Request, res: Response, next: NextFunction) => {
      return res.send("Current user");
    }
  );

  route.post(
    "/signin",
    async (req: Request, res: Response, next: NextFunction) => {
      return res.send("Sign in");
    }
  );

  route.post(
    "/signup",
    async (req: Request, res: Response, next: NextFunction) => {
      await signUpController.signup(req, res, next);
    }
  );

  route.post(
    "/signout",
    async (req: Request, res: Response, next: NextFunction) => {
      return res.send("Sign out");
    }
  );
};
