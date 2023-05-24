import { Inject, Service } from "typedi";
import { Conversation } from "../../interfaces/v1/Conversation";
import ConversationModel from "../../models/v1/Conversation.model";
import { Participant } from "../../interfaces/v1/Participant";
import Logger from "../../loaders/Logger";

@Service()
export class ConversationRepository {
  constructor(private readonly logger: Logger) {}

  public async create(conversation: Conversation) {
    try {
      const newConversation = await ConversationModel.create(conversation);
      return newConversation;
    } catch (error: any) {
      this.logger.error(`Error occured while creating conversation: ${error}`);
      throw error;
    }
  }

  public async get() {}

  public async getById() {}

  public async updateById() {}

  public async deleteById() {}

  public async isConversationWithSameParticipantsExists(
    participants: Participant[]
  ) {
    try {
      console.log(participants);
      const existingConversation = await ConversationModel.findOne({
        participants: {
          $elemMatch: {
            $and: participants.map((participant: Participant) => ({
              user_id: participant.user_id,
              role: participant.role,
            })),
          },
        },
      });
      console.log(existingConversation);
      return existingConversation;
    } catch (error: any) {
      this.logger.error(
        `Error occured while checking whether conversation with same participants exists: ${error}`
      );
      throw error;
    }
  }
}
