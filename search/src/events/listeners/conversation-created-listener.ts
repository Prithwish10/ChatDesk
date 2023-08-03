import { Message, Stan } from "node-nats-streaming";
import Container from "typedi";
import { Subjects, Listener, ConversationCreatedEvent } from "@pdchat/common";
import { queueGroupName } from "./queue-group-name";
import { ConversationRepository } from "../../repositories/Conversation.repository";
import { Types } from "mongoose";
import { logger } from "../../loaders/logger";

export class ConversationCreatedListener extends Listener<ConversationCreatedEvent> {
  subject: Subjects.ConversationCreated = Subjects.ConversationCreated;
  queueGroupName: string = queueGroupName;
  private _conversationRepository: ConversationRepository;

  constructor(client: Stan) {
    super(client);
    this._conversationRepository = Container.get(ConversationRepository);
  }

  async onMessage(
    data: ConversationCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, participants, isGroup, group_name, group_photo, deleted } =
      data;

    try {
      await this._conversationRepository.create({
        _id: new Types.ObjectId(id),
        participants,
        isGroup,
        group_name,
        group_photo,
        deleted,
      });
      logger.info("Acknowledging the conversation creation.");
    } catch (error) {
      logger.info(`Error occured in Conversation Created Listener: ${error}`);
      throw error;
    }

    msg.ack();
  }
}
