import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ParticipantRemovedEvent, Api404Error } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';
import { conversationQueue } from '../../queues/conversation-queue';

const conversationRepository = Container.get(ConversationRepository);

export class ParticipantRemovedListener extends Listener<ParticipantRemovedEvent> {
  subject: Subjects.ParticipantRemoved = Subjects.ParticipantRemoved;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ParticipantRemovedEvent['data'], msg: Message): Promise<void> {
    const { conversationId, participantId, version } = data;
    const conveersation = await conversationRepository.findByIdAndPreviousVersion(
      conversationId,
      version - 1,
    );
    if (!conveersation) {
      throw new Api404Error('Conversation not found.');
    }
    await conversationRepository.removeParticipantFromConversation(conversationId, participantId, version);
    logger.info(
      `✅ Acknowledging the removal of participant from the conversation ${conversationId}.`,
    );
    // const eventData = {
    //   id: conversationId,
    //   participantId,
    //   version,
    // };
    // await conversationQueue.add(`conversation:${data.conversationId}`, eventData, {
    //   jobId: `${data.conversationId}-${data.version}`,
    // });

    logger.info(
      `✅ Acknowledging the participant:removed event (conversationId: ${conversationId}) reveived and added to Bull.`,
    );

    msg.ack();
  }
}
