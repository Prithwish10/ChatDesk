import { Router, Request, Response, NextFunction } from "express";
import { currentUser, requireAuth } from "@pdchat/common";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { SignUpController } from "../controllers/Signup.controller";
import { SignInController } from "../controllers/Signin.controller";
import { UserController } from "../controllers/User.controller";
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

  const signUpController = Container.get(SignUpController);
  const signinController = Container.get(SignInController);
  const signoutController = Container.get(SignoutController);
  const userController = Container.get(UserController);

  route.get(
    "/currentuser",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await userController.currentUser(req, res, next);
    }
  );

  route.post(
    "/signin",
    async (req: Request, res: Response, next: NextFunction) => {
      await signinController.signin(req, res, next);
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
      signoutController.signout(req, res, next);
    }
  );
};
