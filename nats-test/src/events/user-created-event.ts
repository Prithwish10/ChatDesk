import { Subjects } from './subjects';

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
  };
}
