import { Message, Stan } from "node-nats-streaming";
import Container from "typedi";
import {
  Subjects,
  Listener,
  ConversationDeletedEvent,
  Api404Error,
} from "@pdchat/common";
import { queueGroupName } from "./queue-group-name";
import { ConversationRepository } from "../../repositories/Conversation.repository";
import { logger } from "../../loaders/logger";

export class ConversationDeletedListener extends Listener<ConversationDeletedEvent> {
  subject: Subjects.ConversationDeleted = Subjects.ConversationDeleted;
  queueGroupName: string = queueGroupName;
  private _conversationRepository: ConversationRepository;

  constructor(client: Stan) {
    super(client);
    this._conversationRepository = Container.get(ConversationRepository);
  }

  async onMessage(
    data: ConversationDeletedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, version } = data;

    try {
      const conversation =
        await this._conversationRepository.findByIdAndPreviousVersion(
          id,
          version
        );
      if (!conversation) {
        throw new Api404Error("Conversation not found.");
      }

      await this._conversationRepository.deleteByConversation(conversation);
      logger.info("Acknowledging the conversation deletion.");
    } catch (error) {
      logger.info(`Error occured in Conversation Deleted Listener: ${error}`);
      throw error;
    }

    msg.ack();
  }
}
