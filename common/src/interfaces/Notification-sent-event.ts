import { Subjects } from "../enums/subjects";
import { NotificationPriority } from "../enums/NotificationPriority";
import { NotificationType } from "../enums/NotificationType";
import { NotificationContent } from "../types/NotificationContent";

export interface NotificationSentEvent {
  subject:
    | Subjects.HighPriorityNotificationSent
    | Subjects.MediumPriorityNotificationSent
    | Subjects.LowPriorityNotificationSent;
  data: {
    recipientId: string;
    type: NotificationType;
    content: NotificationContent;
    status: string;
    metadata?: Record<string, any>;
    priority?: NotificationPriority;
    attachments?: Array<{ filename: string; content: string | Buffer }>;
  };
}
