import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";

export class MessageSeenHandler
  implements ChannelHandler<{ conversationId: string, messageId: string }>
{
  constructor(private _io: SocketServer) {}

  handle({ conversationId, messageId }: { conversationId: string, messageId: string }): void {
    this._io.to(conversationId).emit("message-seen", conversationId, messageId);
  }
}
