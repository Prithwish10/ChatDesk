import { Server as SocketServer } from "socket.io";
import { logger } from "../../loaders/logger";
import { ChannelHandler } from "../../interfaces/v1/ChannelHandler";

export class ParticipantAddedHandler implements ChannelHandler {
  constructor(private _io: SocketServer) {}

  handle({ userAdded, addedBy, conversationId }: any): void {
    this._io.emit("participant-added", userAdded, addedBy, conversationId);
  }
}
