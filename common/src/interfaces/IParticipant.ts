import { Types } from "mongoose";

export interface IParticipant {
  userId: Types.ObjectId;
  role: string;
  status?: string;
  isAdmin?: boolean;
}
