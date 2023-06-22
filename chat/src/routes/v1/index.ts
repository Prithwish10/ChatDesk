import { Router } from "express";
import messageRoute from "./message.route";
import conversationRoute from "./conversation.route";
import userRoute from "./user.route";

export default () => {
  const app = Router();

  messageRoute(app);
  conversationRoute(app);
  userRoute(app);

  return app;
};
