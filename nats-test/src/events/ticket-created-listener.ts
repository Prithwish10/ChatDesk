import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { UserCreatedEvent } from './user-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = 'payments-service';

  onMessage(data: UserCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.firstName);
    console.log(data.lastName);

    msg.ack();
  }
}
