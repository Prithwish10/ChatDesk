import mongoose from 'mongoose';
import { Types } from 'mongoose';
import { IEvent } from './IEvent';

// An interface that describes the properties required to create a new User.
export interface IUserAttrs {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  image?: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
}

export interface IUser extends Omit<IUserAttrs, '_id'> {
  id: string;
}

// An interface that describes the properties that a User Model has.
export interface IUserModel extends mongoose.Model<IUserDoc> {
  build(attrs: IUserAttrs): IUserDoc;
  findByEvent(event: IEvent): Promise<IUserDoc | null>;
}

export interface IUserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  image?: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  version: number;
}
