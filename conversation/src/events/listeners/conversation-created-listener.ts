import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ConversationCreatedEvent, Api404Error } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { RedisService } from '../../services/Redis.service';
import { logger } from '../../loaders/logger';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { RedisKeyUtil } from '../../utils/Redis.util';

const redisService = Container.get(RedisService);
const conversationRepository = Container.get(ConversationRepository);
const REDIS_EXPIRATION_TIME = 86400;

export class ConversationCreatedListener extends Listener<ConversationCreatedEvent> {
  subject: Subjects.ConversationCreated = Subjects.ConversationCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ConversationCreatedEvent['data'], msg: Message): Promise<void> {
    const { id, participants, isGroup, groupName, groupPhoto, createdBy, deleted, version } = data;
    const redisKey = RedisKeyUtil.lastConversationVersionKey(id);
    const existingVersion = await redisService.get(redisKey);

    if (existingVersion) {
      logger.info(`⚠️ Duplicate conversation:created event detected for ConversationID ${id}, ignoring.`);
      return msg.ack();
    }

    await conversationRepository.create({
      _id: id,
      participants,
      isGroup,
      groupName,
      groupPhoto,
      deleted,
      createdBy,
      version,
    });

    await redisService.set(redisKey, version, REDIS_EXPIRATION_TIME);

    logger.info(`✅ Acknowledging the conversation:created event for ID ${id}, version ${version}`);

    msg.ack();
  }
}
