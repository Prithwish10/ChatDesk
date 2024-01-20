import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";

export class TypingHandler implements ChannelHandler {
  constructor(private _io: SocketServer) {}

  handle(conversationId: string): void {
    this._io.in(conversationId).emit("typing");
  }
}
