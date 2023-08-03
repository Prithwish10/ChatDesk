import express, { Application } from "express";
import cookieSession from "cookie-session";
import morgan from "morgan";
import cors from "cors";
import routes from "../routes/v1/index";
import config from "../config/config.global";
import {
  handle404Error,
  handle422Error,
  handleError,
  currentUser,
  requireAuth
} from "@pdchat/common";

export default ({ app }: { app: Application }) => {
  app.enable("trust proxy");
  app.use(
    cookieSession({
      signed: false,
      secure: true,
    })
  );
  app.use(currentUser);
  app.use(requireAuth);
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  // Load API routes
  app.use(`${config.api.prefix}${config.api.version}/chats`, routes());

  // catch 422 Error and forward to error handler
  app.use(handle422Error);

  // catch 404 Error
  app.use(handle404Error);

  // catch other Errors
  app.use(handleError);
};
