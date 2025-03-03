import 'reflect-metadata';
import { Router, Request, Response, NextFunction } from 'express';
import { currentUser, requireAuth } from '@pdchat/common';
import sanitize from 'mongo-sanitize';
import Container from 'typedi';
import { ConversationController } from '../controllers/Conversation.controller';

const route = Router();

export default (app: Router) => {
  function MongoSanitize(data: any) {
    return sanitize(data);
  }

  app.use('/conversations', route, function (req: Request, res: Response, next: NextFunction) {
    req.body = MongoSanitize(req.body);
    next();
  });

  const conversationController = Container.get(ConversationController);

  route.get(
    '/:userId',
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await conversationController.getByUserId(req, res, next);
    },
  );
};
