import Queue from 'bull';
import { IPayload } from '../interfaces/IPayload';

const conversationQueue = new Queue<IPayload>('conversation-queue', {
  redis: {
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 3,
  },
});

export { conversationQueue };
