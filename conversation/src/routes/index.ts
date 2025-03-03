import { Router } from 'express';
import conversationRoute from './conversation.route';

export default () => {
  const app = Router();
  conversationRoute(app);

  return app;
};
