import { Message } from "node-nats-streaming";
import Container from "typedi";
import { Subjects, Listener, MessageCreatedEvent } from "@pdchat/common";
import { queueGroupName } from "./queue-group-name";
import { MessageRepository } from "../../repositories/v1/Message.repository";
import { MessageService } from "../../services/Message.service"
import { logger } from "../../loaders/logger";

const messageRepository = Container.get(MessageRepository);
const messageService = Container.get(MessageService);

export class MessageCreatedListener extends Listener<MessageCreatedEvent> {
  subject: Subjects.MessageCreated = Subjects.MessageCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(
    data: MessageCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const {
      conversation_id,
      sender_id,
      content,
      deleted,
      status,
      type,
      attachments,
      parent_message_id,
      reactions,
    } = data;

    await messageService.create({
      conversation_id,
      sender_id,
      content,
      deleted,
      status,
      type,
      attachments,
      parent_message_id,
      reactions,
    });
    logger.info("Acknowledging the Message creation.");

    msg.ack();
  }
}
