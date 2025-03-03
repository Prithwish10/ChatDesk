import { Types } from "mongoose";
import { Subjects } from "../enums/subjects";
import { IParticipant } from "./IParticipant";

export interface ConversationUpdatedEvent {
  subject: Subjects.ConversationUpdated;
  data: {
    id: string;
    participants: IParticipant[];
    groupName?: string;
    groupPhoto?: string;
    updatedBy: Types.ObjectId
    deleted: number;
    version: number;
  };
}
