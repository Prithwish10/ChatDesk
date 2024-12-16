import { NotificationType, NotificationContent, NotificationPriority } from '@pdchat/common';

// An interface that describes the properties required to create a new User.
export interface INotificationAttrs {
  recipientId: string;
  type: NotificationType;
  content: NotificationContent;
  status: string;
  metadata?: Record<string, any>;
  priority?: NotificationPriority;
  attachments?: Array<{ filename: string; content: string | Buffer }>;
  error?: string;
}
