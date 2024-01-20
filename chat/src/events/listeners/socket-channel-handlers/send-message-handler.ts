import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";

export class SendMessageHandler implements ChannelHandler {
  constructor(private _io: SocketServer) {}

  handle({ participant, message }: any): void {
    this._io
      .in(participant.user_id.toString())
      .emit("message-received", message);
  }
}
