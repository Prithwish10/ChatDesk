export class RedisKeyUtil {
  static lastMessageUpdate(conversationId: string): string {
    return `conv:${conversationId}:last_message_updated`;
  }

  static conversationUpdate(conversationId: string): string {
    return `conv:${conversationId}:updated`;
  }

  static conversationCreated(conversationId: string): string {
    return `conv:${conversationId}:created`;
  }
}
