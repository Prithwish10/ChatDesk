import { Types } from "mongoose";
import { Subjects } from "../enums/subjects";
import { IParticipant } from "./IParticipant";

export interface ConversationCreatedEvent {
  subject: Subjects.ConversationCreated;
  data: {
    id: string;
    participants: IParticipant[];
    isGroup: boolean;
    groupName?: string;
    groupPhoto?: string;
    createdBy: Types.ObjectId;
    deleted: number;
    version: number;
  };
}
