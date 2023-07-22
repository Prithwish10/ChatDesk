import { Types } from "mongoose";

export interface User {
  _id?: Types.ObjectId
  firstName: string;
  lastName: string;
  image?: string;
  mobileNumber: string;
  email: string;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  image?: string;
  mobileNumber?: string;
  email?: string;
}