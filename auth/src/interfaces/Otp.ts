import mongoose from 'mongoose';

export interface OTPAttrs {
  email: string;
  hashedOtp: string;
  expiration: Date;
}

// An interface that describes the properties that a User Model has.
export interface OTPModel extends mongoose.Model<OTPDoc> {
  build(attrs: OTPAttrs): OTPDoc;
}

// An interface that describes the properties that a User Document has.
export interface OTPDoc extends OTPAttrs, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
