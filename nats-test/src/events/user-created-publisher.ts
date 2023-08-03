import { Publisher } from './base-publisher';
import { UserCreatedEvent } from './user-created-event';
import { Subjects } from './subjects';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
