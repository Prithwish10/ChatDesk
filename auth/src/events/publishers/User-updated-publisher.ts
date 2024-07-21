import { UserUpdatedEvent, Publisher, Subjects } from '@pdchat/common';
import { Service } from 'typedi';

@Service()
export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
