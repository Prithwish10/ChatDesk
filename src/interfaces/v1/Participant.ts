import { Status } from "../../enums/Status";

export interface Participant {
  user_id: string,
  role: string,
  status: String,
  isAdmin?: boolean
}
