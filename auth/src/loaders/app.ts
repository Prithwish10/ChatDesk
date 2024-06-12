import express, { Application } from "express";
import { configureExpress } from "./express";

const createApp = (): Application => {
  const app = express();
  configureExpress({ app });
  return app;
};

export default createApp;
