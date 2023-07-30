import { Message, Stan } from "node-nats-streaming";
import Container from "typedi";
import {
  Subjects,
  Listener,
  ParticipantRemovedEvent,
  Api404Error,
} from "@pdchat/common";
import { queueGroupName } from "./queue-group-name";
import { ConversationRepository } from "../../repositories/Conversation.repository";
import { logger } from "../../loaders/logger";

export class ParticipantsRemovedListener extends Listener<ParticipantRemovedEvent> {
  subject: Subjects.ParticipantRemoved = Subjects.ParticipantRemoved;
  queueGroupName: string = queueGroupName;
  private _conversationRepository: ConversationRepository;

  constructor(client: Stan) {
    super(client);
    this._conversationRepository = Container.get(ConversationRepository);
  }

  async onMessage(
    data: ParticipantRemovedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, participantId } = data;

    try {
      const conversation = await this._conversationRepository.getById(id);
      if (!conversation) {
        throw new Api404Error("Conversation not found.");
      }

      await this._conversationRepository.removeParticipantFromConversation(
        id,
        participantId
      );
      logger.info("Acknowledging the participant removed.");
    } catch (error) {
      logger.info(`Error occured in Participant Removed Listener: ${error}`);
      throw error;
    }

    msg.ack();
  }
}
