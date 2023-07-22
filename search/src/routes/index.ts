import { Router } from "express";
import usersRoute from "./search.route";

export default () => {
  const app = Router();
  usersRoute(app);
  return app;
};
