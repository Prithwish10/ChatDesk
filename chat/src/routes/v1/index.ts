import { Router } from "express";
import messageRoute from "./message.route";
import conversationRoute from "./conversation.route";
import userRoute from "./user.route";

/**
 * Express Router Setup Function
 *
 * This function creates and configures an Express Router instance by attaching various route handlers
 * for messages, conversations, and users to the router. The routes for messages, conversations, and users
 * are defined in separate modules, which are imported and passed to this function.
 *
 * @returns {Router} An Express Router instance with all the defined route handlers attached.
 **/
export default () => {
  const app = Router();

  messageRoute(app);
  conversationRoute(app);
  userRoute(app);

  return app;
};
