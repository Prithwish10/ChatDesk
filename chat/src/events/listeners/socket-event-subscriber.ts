import { Redis } from "ioredis";
import { Server as SocketServer } from "socket.io";
import { SocketEventSubscriber } from "../../interfaces/v1/SocketEventSubscriber";
import { logger } from "../../loaders/logger";
import { Subjects } from "@pdchat/common";
import { ChannelHandler } from "../../interfaces/v1/ChannelHandler";
import { UserConnectedHandler } from "./socket-channel-handlers/user-connected-handler";
import { SendMessageHandler } from "./socket-channel-handlers/send-message-handler";
import { MessageSeenHandler } from "./socket-channel-handlers/message-seen-handler";
import { TypingHandler } from "./socket-channel-handlers/typing-handler";
import { StopTypingHandler } from "./socket-channel-handlers/stop-typing-handler";
import { ConnectedUsersHandler } from "./socket-channel-handlers/connected-users-handler";
import { ParticipantAddedHandler } from "./socket-channel-handlers/participants-added-handler";
import { ParticipantRemovedHandler } from "./socket-channel-handlers/participant-removed-handler";
import { CreateConversationHandler } from "./socket-channel-handlers/conversation-created-handler";
import { WelcomeMessageHandler } from "./socket-channel-handlers/welcome-message-handler";

export class SocketEventSubscriberImpl implements SocketEventSubscriber {
  private _subscriber: Redis;
  private _io: SocketServer;

  private channelHandlers: Record<string, ChannelHandler> = {};

  constructor(subscriber: Redis, io: SocketServer) {
    this._subscriber = subscriber;
    this._io = io;

    // Register channel handlers here
    this.registerHandler(
      Subjects.UserConnectedToChat,
      new UserConnectedHandler(this._io)
    );
    this.registerHandler(
      Subjects.SendMessageToChat,
      new SendMessageHandler(this._io)
    );
    this.registerHandler(Subjects.MessgeSeen, new MessageSeenHandler(this._io));
    this.registerHandler(Subjects.Typing, new TypingHandler(this._io));
    this.registerHandler(Subjects.StopTyping, new StopTypingHandler(this._io));
    this.registerHandler(
      Subjects.ConnectedUsers,
      new ConnectedUsersHandler(this._io)
    );
    this.registerHandler(
      Subjects.ParticipantAddedToChat,
      new ParticipantAddedHandler(this._io)
    );
    this.registerHandler(
      Subjects.ParticipantRemovedFromChat,
      new ParticipantRemovedHandler(this._io)
    );
    this.registerHandler(
      Subjects.ConversationCreated,
      new CreateConversationHandler(this._io)
    );
    this.registerHandler(
      Subjects.WelcomeMessage,
      new WelcomeMessageHandler(this._io)
    );
  }

  private registerHandler(channel: string, handler: ChannelHandler): void {
    this.channelHandlers[channel] = handler;
  }

  subscribe(channel: string) {
    this._subscriber.subscribe(channel);
  }

  listen() {
    this._subscriber.on("message", (receivedChannel, data) => {
      const handler = this.channelHandlers[receivedChannel];
      if (handler) {
        handler.handle(JSON.parse(data));
      } else {
        logger.warn(`Unhandled channel: ${receivedChannel}`);
      }
    });
  }
}
