import express, { Application } from "express";
import { handle404Error, handle422Error, handleError } from "@pdchat/common";
import cookieSession from "cookie-session";
import morgan from "morgan";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import config from "../config/config.global";
import routes from "../routes/index";
import swaggerSpec from "../swagger/swagger";

export const configureExpress = ({ app }: { app: Application }): void => {
  app.set("trust proxy", true);
  app.use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== "test",
    })
  );
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  // Serve Swagger documentation
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  // Load API routes
  app.use(`${config.api.prefix}${config.api.version}`, routes());

  // catch 422 Error and forward to error handler
  app.use(handle422Error);

  // catch 404 Error
  app.use(handle404Error);

  // catch other Errors
  app.use(handleError);
};
