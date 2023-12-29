import Type from "mongoose";

export interface Reaction {
  user_id: Type.ObjectId;
  reaction: string;
}
