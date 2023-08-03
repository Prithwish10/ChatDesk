import mongoose from "mongoose";
import { Types } from "mongoose";
import { Event } from "../../interfaces/v1/Event";

// An interface that describes the properties required to create a new User.
export interface UserAttrs {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  image?: string;
  email: string;
  mobileNumber: string;
}

// An interface that describes the properties that a User Model has.
export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: Event): Promise<UserDoc | null>;
}

export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  image?: string;
  email: string;
  mobileNumber: string;
  version: number;
}
