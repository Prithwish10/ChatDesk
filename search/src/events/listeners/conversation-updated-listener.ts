import { Message, Stan } from "node-nats-streaming";
import Container from "typedi";
import {
  Subjects,
  Listener,
  ConversationUpdatedEvent,
  Api404Error,
} from "@pdchat/common";
import { queueGroupName } from "./queue-group-name";
import { ConversationRepository } from "../../repositories/Conversation.repository";
import { Types } from "mongoose";
import { logger } from "../../loaders/logger";

export class ConversationUpdatedListener extends Listener<ConversationUpdatedEvent> {
  subject: Subjects.ConversationUpdated = Subjects.ConversationUpdated;
  queueGroupName: string = queueGroupName;
  private _conversationRepository: ConversationRepository;

  constructor(client: Stan) {
    super(client);
    this._conversationRepository = Container.get(ConversationRepository);
  }

  async onMessage(
    data: ConversationUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, participants, group_name, group_photo, deleted } = data;
    
    try {
      const conversation = await this._conversationRepository.getById(id);
      if (!conversation) {
        throw new Api404Error("Conversation not found.");
      }

      await this._conversationRepository.updateById(id, {
        _id: new Types.ObjectId(id),
        participants,
        group_name,
        group_photo,
        deleted,
      });
      logger.info("Acknowledging the conversation updation.");
    } catch (error) {
      logger.info(`Error occured in Conversation Updated Listener: ${error}`);
      //   throw error;
      return;
    }

    msg.ack();
  }
}
