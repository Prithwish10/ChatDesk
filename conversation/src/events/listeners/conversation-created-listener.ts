import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ConversationCreatedEvent } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { Types } from 'mongoose';
import { logger } from '../../loaders/logger';

const conversationRepository = Container.get(ConversationRepository);

export class ConversationCreatedListener extends Listener<ConversationCreatedEvent> {
  subject: Subjects.ConversationCreated = Subjects.ConversationCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ConversationCreatedEvent['data'], msg: Message): Promise<void> {
    const { participants, isGroup, groupName, groupPhoto, createdBy, deleted } = data;

    await conversationRepository.create({
      participants,
      isGroup,
      groupName,
      groupPhoto,
      deleted,
      createdBy,
      lastMessageTimestamp: new Date(),
      lastMessage: '',
    });

    logger.info('Acknowledging the user creation.');

    msg.ack();
  }
}
