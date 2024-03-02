import { Router } from "express";
import signUpRoute from "./signup.route";
import signInRoute from "./signin.route";
import signOutRoute from "./signout.route";
import currentUserRoute from "./currentuser.route";

export default () => {
  const app = Router();
  signUpRoute(app);
  signInRoute(app);
  signOutRoute(app);
  currentUserRoute(app);

  return app;
};
