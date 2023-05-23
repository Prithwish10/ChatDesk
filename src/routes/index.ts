import { Router } from "express";
import messageRoute from "./message.route";
import conversationRoute from "./conversation.route";

export default () => {
  const app = Router();

  messageRoute(app);
  conversationRoute(app);

  return app;
};
