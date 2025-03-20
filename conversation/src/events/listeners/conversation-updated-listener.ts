import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ConversationUpdatedEvent, Api404Error } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';
import { conversationQueue } from '../../queues/conversation-queue';

const conversationRepository = Container.get(ConversationRepository);

export class ConversationUpdatedListener extends Listener<ConversationUpdatedEvent> {
  subject: Subjects.ConversationUpdated = Subjects.ConversationUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ConversationUpdatedEvent['data'], msg: Message): Promise<void> {
    const { id, participants, groupName, groupPhoto, deleted, version } = data;

    const conveersation = await conversationRepository.findByIdAndPreviousVersion(id, version - 1);
    if (!conveersation) {
      throw new Api404Error("Conversation not found.");
    }

    await conversationRepository.updateConversation(id, {
      participants,
      groupName,
      groupPhoto,
      deleted,
    }, version);  

    // await conversationQueue.add(`conversation:${data.id}`, data, {
    //   jobId: `${data.id}-${data.version}`,
    // });

    logger.info('✅ Acknowledging the conversation:updated event reveived and added to Bull.');

    msg.ack();
  }
}
