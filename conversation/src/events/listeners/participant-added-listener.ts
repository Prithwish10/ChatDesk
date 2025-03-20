import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ParticipantsAddedEvent, Api404Error } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';
import { conversationQueue } from '../../queues/conversation-queue';

const conversationRepository = Container.get(ConversationRepository);

export class ParticipantsAddedListener extends Listener<ParticipantsAddedEvent> {
  subject: Subjects.ParticipantsAdded = Subjects.ParticipantsAdded;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ParticipantsAddedEvent['data'], msg: Message): Promise<void> {
    const { participants, conversationId, version } = data;

    const conveersation = await conversationRepository.findByIdAndPreviousVersion(conversationId, version - 1);
    if (!conveersation) {
      throw new Api404Error('Conversation not found.');
    }
    await conversationRepository.addParticipantsToConversation(conversationId, participants, version);
    // const eventData = {
    //   id: conversationId,
    //   participants,
    //   version
    // }
    // await conversationQueue.add(`conversation:${data.conversationId}`, eventData, {
    //   jobId: `${data.conversationId}-${data.version}`,
    // });

    logger.info(
      `✅ Acknowledging the participant:added event (conversationId: ${conversationId}) reveived and added to Bull.`,
    );

    msg.ack();
  }
}
