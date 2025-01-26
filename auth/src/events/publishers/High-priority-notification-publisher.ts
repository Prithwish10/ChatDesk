import { Publisher, Subjects, NotificationSentEvent } from '@pdchat/common';
import { Service } from 'typedi';

@Service()
export class HighPriorityNotificationPublisher extends Publisher<NotificationSentEvent> {
  subject: Subjects.HighPriorityNotificationSent = Subjects.HighPriorityNotificationSent;
}
