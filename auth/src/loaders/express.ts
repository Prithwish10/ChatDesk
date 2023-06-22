import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import config from "../config/config.global";
import routes from "../routes/index";

export default ({ app }: { app: Application }) => {
  app.enable("trust proxy");

  app.use(cors());

  app.use(express.json());

  app.use(morgan("dev"));

  // Load API routes
  app.use(`${config.api.prefix}${config.api.version}`, routes());
};
