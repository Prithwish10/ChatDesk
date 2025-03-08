import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ConversationUpdatedEvent } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';

const conversationRepository = Container.get(ConversationRepository);

export class ConversationUpdatedListener extends Listener<ConversationUpdatedEvent> {
  subject: Subjects.ConversationUpdated = Subjects.ConversationUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ConversationUpdatedEvent['data'], msg: Message): Promise<void> {
    const { id, participants, groupName, groupPhoto, deleted } = data;

    await conversationRepository.updateConversation(id, {
      participants,
      groupName,
      groupPhoto,
      deleted,
    });  

    logger.info('Acknowledging the user creation.');

    msg.ack();
  }
}
