import { UserCreatedEvent, Publisher, Subjects } from '@pdchat/common';
import { Service } from 'typedi';

@Service()
export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
