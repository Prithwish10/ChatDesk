import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ConversationCreatedEvent, Api404Error } from '@pdchat/common';
import { RedisStream } from '@pdchat/common';
import { conversationQueue } from '../../queues/conversation-queue';
import { queueGroupName } from './queue-group-name';
import { RedisService } from '../../services/Redis.service';
import { logger } from '../../loaders/logger';
import { ConversationRepository } from '../../repositories/Conversation.repository';

const redisService = Container.get(RedisService);
const conversationRepository = Container.get(ConversationRepository);

export class ConversationCreatedListener extends Listener<ConversationCreatedEvent> {
  subject: Subjects.ConversationCreated = Subjects.ConversationCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ConversationCreatedEvent['data'], msg: Message): Promise<void> {
    // await redisService.publishToStream(RedisStream.createConversation, data);
    // await conversationQueue.add(`conversation:${data.id}`, data, {
    //   jobId: `${data.id}-${data.version}`,
    // });
    const { id, participants, isGroup, groupName, groupPhoto,createdBy, deleted, version } = data;
    await conversationRepository.create({
      _id: id,
      participants,
      isGroup,
      groupName,
      groupPhoto,
      deleted,
      createdBy,
      version
    });
    
    logger.info('✅ Acknowledging the conversation:created event reveived and added to Bull.');

    msg.ack();
  }
}
