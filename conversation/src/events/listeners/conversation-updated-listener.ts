import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ConversationUpdatedEvent, Api404Error } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';
import { RedisKeyUtil } from '../../utils/Redis.util';
import { RedisService } from '../../services/Redis.service';

const conversationRepository = Container.get(ConversationRepository);
const redisService = Container.get(RedisService);
const REDIS_EXPIRATION_TIME = 86400;

export class ConversationUpdatedListener extends Listener<ConversationUpdatedEvent> {
  subject: Subjects.ConversationUpdated = Subjects.ConversationUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ConversationUpdatedEvent['data'], msg: Message): Promise<void> {
    const { id, participants, groupName, groupPhoto, deleted, version } = data;
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

    await conversationRepository.updateConversation(
      id,
      {
        participants,
        groupName,
        groupPhoto,
        deleted,
      },
      version,
    );

    await redisService.set(redisKey, version, REDIS_EXPIRATION_TIME);

    logger.info(`✅ Acknowledging the conversation:updated event for ID ${id}, version ${version}`);

    msg.ack();
  }
}
