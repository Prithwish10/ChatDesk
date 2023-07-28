import { Subjects } from "../enums/subjects";

export interface UserUpdatedEvent {
  subject: Subjects.UserUpdated;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    version: number;
  };
}
