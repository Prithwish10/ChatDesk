import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, MessageCreatedEvent } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { RedisService } from '../../services/Redis.service';
import { logger } from '../../loaders/logger';
import { IMessageAttrs } from '../../interfaces/IMessage';

const redisService = Container.get(RedisService);

export class MessageCreatedListener extends Listener<MessageCreatedEvent> {
  subject: Subjects.MessageCreated = Subjects.MessageCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: MessageCreatedEvent['data'], msg: Message): Promise<void> {
    await redisService.storeMessage(data as unknown as IMessageAttrs);
    logger.info('Acknowledging the Message inserted into Redis.');

    msg.ack();
  }
}
