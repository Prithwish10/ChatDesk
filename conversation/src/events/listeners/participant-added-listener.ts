import { Message } from 'node-nats-streaming';
import Container from 'typedi';
import { Subjects, Listener, ParticipantsAddedEvent, Api404Error } from '@pdchat/common';
import { queueGroupName } from './queue-group-name';
import { ConversationRepository } from '../../repositories/Conversation.repository';
import { logger } from '../../loaders/logger';
import { RedisKeyUtil } from '../../utils/Redis.util';
import { RedisService } from '../../services/Redis.service';

const conversationRepository = Container.get(ConversationRepository);
const redisService = Container.get(RedisService);
const REDIS_EXPIRATION_TIME = 86400;

export class ParticipantsAddedListener extends Listener<ParticipantsAddedEvent> {
  subject: Subjects.ParticipantsAdded = Subjects.ParticipantsAdded;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ParticipantsAddedEvent['data'], msg: Message): Promise<void> {
    const { participants, conversationId, version } = data;
    const redisKey = RedisKeyUtil.lastConversationVersionKey(conversationId);
    const existingVersion = await redisService.get(redisKey);
    let lastVersion: bigint | null = existingVersion ? BigInt(existingVersion) : null;

    if (!lastVersion || lastVersion !== BigInt(version) - 1n) {
      logger.info(
        `Tracking unordered event. Cache might be outdated. Fetching from db for Conversation ID ${conversationId}, version ${version}.`,
      );
      const conversation = await conversationRepository.findByIdAndPreviousVersion(
        conversationId,
        version,
      );
      if (!conversation) {
        throw new Api404Error(
          `⚠️ Conversation not found with ID ${conversationId} and version ${version}. Skipping unordered event for later processing.`,
        );
      }
    }

    await conversationRepository.addParticipantsToConversation(
      conversationId,
      participants,
      version,
    );

    await redisService.set(redisKey, version, REDIS_EXPIRATION_TIME);

    logger.info(
      `✅ Acknowledging the participant:added event for ID ${conversationId}, version ${version}`,
    );

    msg.ack();
  }
}
