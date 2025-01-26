import mongoose from 'mongoose';
import { OTPContext } from '../enums/OTPContext';

export interface OTPAttrs {
  recipientId: string;
  hashedOtp: string;
  expiration: Date;
  context?: OTPContext;
}

// An interface that describes the properties that a User Model has.
export interface OTPModel extends mongoose.Model<OTPDoc> {
  build(attrs: OTPAttrs): OTPDoc;
}

// An interface that describes the properties that a User Document has.
export interface OTPDoc extends OTPAttrs, mongoose.Document {
  createdAt: Date;
  version: number;
}
