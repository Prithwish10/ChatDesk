import { Redis } from "ioredis";
import { Server as SocketServer } from "socket.io";
import { SocketEventSubscriber } from "../../interfaces/v1/SocketEventSubscriber";
import { logger } from "../../loaders/logger";
import { Subjects } from "@pdchat/common";
import { ChannelHandler } from "../../interfaces/v1/ChannelHandler";
import { UserConnectedHandler } from "./user-connected-handler";
import { SendMessageHandler } from "./send-message-handler";
import { MessageSeenHandler } from "./message-seen-handler";
import { TypingHandler } from "./typing-handler";
import { StopTypingHandler } from "./stop-typing-handler";
import { ConnectedUsersHandler } from "./connected-users-handler";
import { ParticipantAddedHandler } from "./participants-added-handler";
import { ParticipantRemovedHandler } from "./participant-removed-handler";

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
