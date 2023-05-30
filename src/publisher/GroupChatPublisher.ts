import MessagePublisher from "../interfaces/MessagePublisher";

class GroupChatPublisher implements MessagePublisher {
  private rabbitMQUrl: string;
  private exchangeName: string;

  constructor(rabbitMQUrl: string, exchangeName: string) {
    this.rabbitMQUrl = rabbitMQUrl;
    this.exchangeName = exchangeName;
  }

  // Publish group message
  publishMessage(conversation_id: string, message: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default GroupChatPublisher;
