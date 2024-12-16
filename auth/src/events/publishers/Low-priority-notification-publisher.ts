import { Publisher, Subjects, NotificationSentEvent } from '@pdchat/common';
import { Service } from 'typedi';

@Service()
export class LowPriorityNotificationPublisher extends Publisher<NotificationSentEvent> {
  subject: Subjects.LowPriorityNotificationSent = Subjects.LowPriorityNotificationSent;
}
