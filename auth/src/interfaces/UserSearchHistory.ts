import Type from "mongoose";

export interface UserSearchHistory {
  userId: Type.ObjectId;
  searchedUserId: Type.ObjectId;
}
