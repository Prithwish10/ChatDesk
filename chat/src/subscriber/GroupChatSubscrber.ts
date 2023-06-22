import MessageSubscriber from "../interfaces/MessageSubscriber";

class GroupChatSubscriber implements MessageSubscriber {
  private rabbitMQUrl: string;
  private exchangeName: string;

  constructor(rabbitMQUrl: string, exchangeName: string) {
    this.rabbitMQUrl = rabbitMQUrl;
    this.exchangeName = exchangeName;
  }

  // Consume group chat message
  consumeMessage(conversation_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default GroupChatSubscriber;