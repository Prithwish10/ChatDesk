import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ConversationDeletedEvent, Api404Error } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';
import { RedisKeyUtil } from '../../utils/Redis.util';
import { RedisService } from '../../services/Redis.service';

const conversationRepository = Container.get(ConversationRepository);
const redisService = Container.get(RedisService);
const REDIS_EXPIRATION_TIME = 86400;

export class ConversationDeletedListener extends Listener<ConversationDeletedEvent> {
  subject: Subjects.ConversationDeleted = Subjects.ConversationDeleted;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ConversationDeletedEvent['data'], msg: Message): Promise<void> {
    const { id, deletedFor, version } = data;
    const redisKey = RedisKeyUtil.lastConversationVersionKey(id);
    const existingVersion = await redisService.get(redisKey);
    let lastVersion: bigint | null = existingVersion ? BigInt(existingVersion) : null;

    if (!lastVersion || lastVersion !== BigInt(version) - 1n) {
      logger.info(
        `Tracking unordered event. Cache might be outdated. Fetching from db for Conversation ID ${id}, version ${version}.`,
      );
      const conversation = await conversationRepository.findByIdAndPreviousVersion(id, version);
      if (!conversation) {
        throw new Api404Error(
          `⚠️ Conversation not found with ID ${id} and version ${version}. Skipping unordered event for later processing.`,
        );
      }
    }

    await conversationRepository.deleteUserConversation(id, deletedFor, version);

    await redisService.set(redisKey, version, REDIS_EXPIRATION_TIME);

    logger.info(`✅ Acknowledging the conversation:created event for ID ${id}, version ${version}`);

    msg.ack();
  }
}
