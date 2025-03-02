import Type from "mongoose";

export interface IReaction {
  user: {
    id: Type.ObjectId;
    firstName: string;
    lastName: string;
    image?: string;
  };
  reaction: string;
}
