import { Server as SocketServer, Socket } from "socket.io";
import { Redis } from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";
import { Inject } from "typedi";
import { Subjects } from "@pdchat/common";
import { currentUser, requireAuth } from "@pdchat/common";
import { logger } from "../loaders/logger";
import { ConversationRepository } from "../repositories/v1/Conversation.repository";
import { Participant } from "../interfaces/v1/Participant";
import { IUser, UserAttrs } from "../interfaces/v1/User";
import Presence from "../services/Presence";
import { ConversationAttrs } from "../interfaces/v1/Conversation";
import { MessageAttrs } from "../interfaces/v1/Message";
import { MessageRepository } from "../repositories/v1/Message.repository";
import { natsWrapper } from "../loaders/NatsWrapper";
import { MessageCreatedPublisher } from "../events/publishers/message-created-publisher";
import { SocketEventPublisher } from "../interfaces/v1/SocketEventPublisher";
import { SocketEventSubscriber } from "../interfaces/v1/SocketEventSubscriber";
import { SocketEventSubscriberImpl } from "../events/listeners/socket-event-subscriber";
import { SucketEventPublisherImpl } from "../events/publishers/socket-event-publisher";

declare module "socket.io" {
  interface Socket {
    user: IUser;
  }
}

class ChatServer {
  private _io: SocketServer;
  private _presence: Presence;
  private _pubClient: Redis;
  private _subClient: Redis;
  @Inject()
  private _conversationRepository: ConversationRepository;
  @Inject()
  private _messageRepository: MessageRepository;
  private _socketEventPublisher: SocketEventPublisher;
  private _socketEventSubscriber: SocketEventSubscriber;

  constructor(server: any, socketOptions: any, presence: Presence) {
    this._io = new SocketServer(server, socketOptions);
    this._presence = presence;
    const redisClient = this._presence.getClient();

    this._pubClient = redisClient.duplicate();
    this._subClient = redisClient.duplicate();
    this._io.adapter(createAdapter(this._pubClient, this._subClient));

    this._socketEventPublisher = new SucketEventPublisherImpl(this._pubClient);
    this._socketEventSubscriber = new SocketEventSubscriberImpl(
      this._subClient,
      this._io
    );

    this._socketEventSubscriber.subscribe(Subjects.WelcomeMessage);
    this._socketEventSubscriber.subscribe(Subjects.ConversationCreated);
    this._socketEventSubscriber.subscribe(Subjects.UserConnectedToChat);
    this._socketEventSubscriber.subscribe(Subjects.SendMessageToChat);
    this._socketEventSubscriber.subscribe(Subjects.ParticipantAddedToChat);
    this._socketEventSubscriber.subscribe(Subjects.ParticipantRemovedFromChat);
    this._socketEventSubscriber.subscribe(Subjects.MessgeSeen);
    this._socketEventSubscriber.subscribe(Subjects.Typing);
    this._socketEventSubscriber.subscribe(Subjects.StopTyping);
    this._socketEventSubscriber.subscribe(Subjects.ConnectedUsers);
    this._socketEventSubscriber.listen();
  }

  public configureSocketEvents(): void {
    this._io.on("connection", (socket: Socket) => {
      logger.info(`User connected to Socket ID: ${socket.id}`);
      this._socketEventPublisher.publish(
        Subjects.WelcomeMessage,
        JSON.stringify({ message: "Welcome to Chatdesk!" })
      );

      socket.on("add-user", async (user: IUser) => {
        logger.info(`User connected: ${JSON.stringify(user)}`);
        await this._presence.upsert(user.id, socket.id);
        this._socketEventPublisher.publish(
          Subjects.UserConnectedToChat,
          JSON.stringify(user)
        );
        socket.user = user;
        socket.join(user.id);
      });

      socket.on(
        "create-conversation",
        (conversationId: string, participants: Participant[]) => {
          this._socketEventPublisher.publish(
            Subjects.ConversationCreated,
            JSON.stringify({ participants, conversationId })
          );
        }
      );

      socket.on(
        "add-participant",
        (userAdded: IUser, addedBy: IUser, conversationId: string) => {
          this._socketEventPublisher.publish(
            Subjects.ParticipantAddedToChat,
            JSON.stringify({ userAdded, addedBy, conversationId })
          );
        }
      );

      socket.on(
        "remove-participant",
        (userRemoved: IUser, removedBy: IUser, conversationId: string) => {
          this._socketEventPublisher.publish(
            Subjects.ParticipantRemovedFromChat,
            JSON.stringify({ userRemoved, removedBy, conversationId })
          );
        }
      );

      socket.on("conversation-list", async (userId: string) => {
        try {
          const conversations =
            await this._conversationRepository.getUserConversations(userId);
          socket.to(userId).emit("conversation-list", conversations);
        } catch (error) {
          return new Error(`${error}`);
        }
      });

      socket.on("message-list", async (userId, conversationId: string) => {
        try {
          const messages =
            await this._messageRepository.getMessagesForAConversation(
              conversationId
            );
          socket.to(userId).emit("conversation-list", messages);
        } catch (error) {
          return new Error(`${error}`);
        }
      });

      socket.on("join-conversation", (conversation_id: string, callback) => {
        socket.join(conversation_id);
        logger.info(`User joined conversation: ${conversation_id}`);
        callback("Joined");
      });

      socket.on(
        "send-message",
        async (
          message: MessageAttrs,
          conversation: ConversationAttrs,
          callback
        ) => {
          const participants = conversation.participants;

          if (participants) {
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
            } = message;
            await new MessageCreatedPublisher(natsWrapper.client).publish({
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

            participants.forEach((participant: Participant) => {
              if (
                participant.user_id.toString() === message.sender_id.toString()
              )
                return;

              this._socketEventPublisher.publish(
                Subjects.SendMessageToChat,
                JSON.stringify({ participant, message })
              );
            });
            callback("sent");
          }
        }
      );

      socket.on("message-seen", (conversationId: string, messageId: string) => {
        this._socketEventPublisher.publish(
          Subjects.MessgeSeen,
          JSON.stringify({ conversationId, messageId })
        );
      });

      socket.on("typing", (conversationId: string) => {
        this._socketEventPublisher.publish(Subjects.Typing, conversationId);
      });

      socket.on("stop-typing", (conversationId: string) => {
        this._socketEventPublisher.publish(Subjects.StopTyping, conversationId);
      });

      socket.conn.on("heartbeat", async () => {
        if (!socket.user) {
          return;
        }
        await this._presence.upsert(socket.id, socket.user.id);
      });

      socket.on(
        "last-checked-conversation",
        (conversation_id: string, user_id: string) => {
          this._conversationRepository.updateParticipantsLastCheckedTimeByConversationId(
            conversation_id,
            user_id
          );
        }
      );

      socket.on("disconnect", async () => {
        logger.info(
          `User disconnected with socketId ${socket.id}: ${socket.user}`
        );

        if (socket.user) {
          const userId = socket.user.id;
          await this._presence.remove(userId);
          const connectedUsers = await this._presence.getList();
          this._socketEventPublisher.publish(
            Subjects.ConnectedUsers,
            JSON.stringify(connectedUsers)
          );
          socket.leave(userId);
        }
      });
    });
  }
}

export default ChatServer;
