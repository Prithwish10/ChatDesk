import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ConversationDeletedEvent } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';

const conversationRepository = Container.get(ConversationRepository);

export class ConversationDeletedListener extends Listener<ConversationDeletedEvent> {
  subject: Subjects.ConversationDeleted = Subjects.ConversationDeleted;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ConversationDeletedEvent['data'], msg: Message): Promise<void> {
    const { id, deletedFor } = data;
    await conversationRepository.deleteUserConversation(id, deletedFor);
    logger.info('Acknowledging the conversation deletion.');

    msg.ack();
  }
}
