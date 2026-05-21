import { Router } from 'express';
import messageRoute from './message.route';

export default () => {
  const app = Router();
  messageRoute(app);

  return app;
};
