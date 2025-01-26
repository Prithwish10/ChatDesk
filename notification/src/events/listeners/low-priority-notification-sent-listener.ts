import { Message } from 'node-nats-streaming';
import { Subjects, Listener, NotificationSentEvent } from '@pdchat/common';
import { queueGroupNameForLowPriorityNotification } from './queue-group-name';
import { logger } from '../../loaders/logger';
import { NotificationService } from '../../services/Notification.service';
import { NotificationFactory } from '../../services/NotificationFactory.service';
import { INotificationAttrs } from '../../interfaces/INotificationAttrs';

export class LowPriorityNotificationSentListener extends Listener<NotificationSentEvent> {
  subject: Subjects.LowPriorityNotificationSent = Subjects.LowPriorityNotificationSent;
  queueGroupName: string = queueGroupNameForLowPriorityNotification;

  async onMessage(data: NotificationSentEvent['data'], msg: Message): Promise<void> {
    const { type } = data;
    const notificationStrategy = NotificationFactory.createNotification(type);
    const notificationService = new NotificationService(notificationStrategy);
    notificationService.notify(data as INotificationAttrs);

    logger.info('Acknowledging the send email.');
    msg.ack();
  }
}
