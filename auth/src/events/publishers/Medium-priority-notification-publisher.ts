import { Publisher, Subjects, NotificationSentEvent } from '@pdchat/common';
import { Service } from 'typedi';

@Service()
export class MediumPriorityNotificationPublisher extends Publisher<NotificationSentEvent> {
  subject: Subjects.MediumPriorityNotificationSent = Subjects.MediumPriorityNotificationSent;
}
