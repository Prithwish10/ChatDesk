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
    const {
      conversation_id,
      messageId,
      sender,
      content,
      type,
      attachments,
      parent_message_id,
      status,
      deleted,
      reactions,
    } = data;
    await redisService.storeMessage({
      conversationId: conversation_id,
      messageId,
      sender: {
        senderId: sender.id,
        senderFirstName: sender.firstname,
        senderLastName: sender.lastname,
        senderImage: sender.image,
      },
      content,
      type,
      attachments,
      parentMessageId: parent_message_id,
      status,
      deleted,
      reactions,
    });

    logger.info('Acknowledging the Message insertion into Redis.');

    msg.ack();
  }
}
