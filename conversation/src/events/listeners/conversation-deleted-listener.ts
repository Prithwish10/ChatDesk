import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ConversationDeletedEvent, Api404Error } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';
import { conversationQueue } from '../../queues/conversation-queue';

const conversationRepository = Container.get(ConversationRepository);

export class ConversationDeletedListener extends Listener<ConversationDeletedEvent> {
  subject: Subjects.ConversationDeleted = Subjects.ConversationDeleted;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ConversationDeletedEvent['data'], msg: Message): Promise<void> {
    const { id, deletedFor, version } = data;

    const conveersation = await conversationRepository.findByIdAndPreviousVersion(id, version - 1);
    if (!conveersation) {
      throw new Api404Error('Conversation not found.');
    }
    await conversationRepository.deleteUserConversation(id, deletedFor, version);

    // await conversationQueue.add(`conversation:${data.id}`, data, {
    //   jobId: `${data.id}-${data.version}`,
    // });

    logger.info('✅ Acknowledging the conversation:deleted event reveived and added to Bull.');

    msg.ack();
  }
}
