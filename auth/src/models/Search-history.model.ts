import mongoose, { Types } from "mongoose";
import { UserSearchHistory } from "../interfaces/UserSearchHistory";

const userSearchHistorySchema = new mongoose.Schema<UserSearchHistory>({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  searchedUserId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default mongoose.model<UserSearchHistory>(
  "UserSearchHistory",
  userSearchHistorySchema
);
