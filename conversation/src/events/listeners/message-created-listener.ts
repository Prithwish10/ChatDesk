import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, MessageCreatedEvent } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { RedisService } from '../../services/Redis.service';
import { logger } from '../../loaders/logger';

const redisService = Container.get(RedisService);

export class MessageCreatedListener extends Listener<MessageCreatedEvent> {
  subject: Subjects.MessageCreated = Subjects.MessageCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: MessageCreatedEvent['data'], msg: Message): Promise<void> {
    const {
      conversation_id,
      messageId,
      content,
      createdAt
    } = data;
    await redisService.storeMessage({
      conversationId: conversation_id,
      messageId,
      content,
      createdAt
    });

    logger.info('Acknowledging the Message insertion into Redis.');

    msg.ack();
  }
}
