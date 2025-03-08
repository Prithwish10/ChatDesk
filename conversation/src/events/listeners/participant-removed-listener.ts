import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ParticipantRemovedEvent } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';

const conversationRepository = Container.get(ConversationRepository);

export class ParticipantRemovedListener extends Listener<ParticipantRemovedEvent> {
  subject: Subjects.ParticipantRemoved = Subjects.ParticipantRemoved;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ParticipantRemovedEvent['data'], msg: Message): Promise<void> {
    const { conversationId, participantId } = data;
    await conversationRepository.removeParticipantFromConversation(conversationId, participantId);
    logger.info(
      `✅ Acknowledging the removal of participant from the conversation ${conversationId}.`,
    );

    msg.ack();
  }
}
