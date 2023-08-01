import mongoose, { Types } from "mongoose";

// An interface that describes the properties required to create a new User.
export interface UserAttrs {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  image: string;
  mobileNumber: string;
  email: string;
  password: string;
}

// An interface that describes the properties that a User Model has.
export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has.
export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  image: string;
  mobileNumber: string;
  email: string;
  password: string;
  version: number;
}
