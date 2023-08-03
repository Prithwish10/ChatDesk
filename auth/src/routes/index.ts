import { Router } from "express";
import usersRoute from "./users.route";

export default () => {
  const app = Router();

  usersRoute(app);

  return app;
};
