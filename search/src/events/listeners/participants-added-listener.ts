import { Message, Stan } from "node-nats-streaming";
import Container from "typedi";
import {
  Subjects,
  Listener,
  ParticipantsAddedEvent,
  Api404Error,
} from "@pdchat/common";
import { queueGroupName } from "./queue-group-name";
import { ConversationRepository } from "../../repositories/Conversation.repository";
import { logger } from "../../loaders/logger";

export class ParticipantsAddedListener extends Listener<ParticipantsAddedEvent> {
  subject: Subjects.ParticipantsAdded = Subjects.ParticipantsAdded;
  queueGroupName: string = queueGroupName;
  private _conversationRepository: ConversationRepository;

  constructor(client: Stan) {
    super(client);
    this._conversationRepository = Container.get(ConversationRepository);
  }

  async onMessage(
    data: ParticipantsAddedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, participants } = data;

    try {
      const conversation = await this._conversationRepository.getById(id);
      if (!conversation) {
        throw new Api404Error("Conversation not found.");
      }

      await this._conversationRepository.addParticipantsToConversation(
        id,
        participants
      );
      logger.info("Acknowledging the participants added.");
    } catch (error) {
      logger.info(`Error occured in Participants Added Listener: ${error}`);
      throw error;
    }

    msg.ack();
  }
}
