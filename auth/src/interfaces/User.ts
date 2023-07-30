import { Types } from "mongoose";

export interface User {
  id?: Types.ObjectId
  firstName: string;
  lastName: string;
  image: string;
  mobileNumber: string;
  email: string;
  password: string;
  version?: number;
}