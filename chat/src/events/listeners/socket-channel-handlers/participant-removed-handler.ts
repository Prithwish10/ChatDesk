import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";

export class ParticipantRemovedHandler implements ChannelHandler {
  constructor(private _io: SocketServer) {}

  handle({ userRemoved, removedBy, conversationId }: any): void {
    this._io.emit(
      "participant-removed",
      userRemoved,
      removedBy,
      conversationId
    );
  }
}
