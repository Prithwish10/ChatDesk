import { Subjects } from "../enums/subjects";
import { NotificationPriority } from "../enums/NotificationPriority";
import { NotificationType } from "../enums/NotificationType";

export interface NotificationSentEvent {
  subject: Subjects.NotificationSent;
  data: {
    type: NotificationType,
    recipientId: string,
    subjectLine?: string,
    body: string,
    metadata?: Record<string, any>,
    priority?: NotificationPriority,
    attachments?: Array<{ filename: string; content: string | Buffer }>
  };
}
