import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ParticipantsAddedEvent } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';

const conversationRepository = Container.get(ConversationRepository);

export class ParticipantsAddedListener extends Listener<ParticipantsAddedEvent> {
  subject: Subjects.ParticipantsAdded = Subjects.ParticipantsAdded;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ParticipantsAddedEvent['data'], msg: Message): Promise<void> {
    const { participants, conversationId } = data;
    await conversationRepository.addParticipantsToConversation(conversationId, participants);
    logger.info(
      `✅ Acknowledging the addition of new participant to the conversation ${conversationId}.`,
    );

    msg.ack();
  }
}
