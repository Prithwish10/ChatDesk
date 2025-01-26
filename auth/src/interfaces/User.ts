import mongoose from 'mongoose';

// An interface that describes the properties required to create a new User.
export interface UserAttrs {
  firstName: string;
  lastName: string;
  image: string;
  mobileNumber: string;
  countryCode: string;
  email: string;
  password: string;
}

// An interface that describes the properties that a User Model has.
export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has.
export interface UserDoc extends UserAttrs, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
