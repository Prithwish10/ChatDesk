import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";
import { UserAttrs } from "../../../interfaces/v1/User";

export class ParticipantRemovedHandler
  implements
    ChannelHandler<{
      userRemoved: UserAttrs,
      removedBy: UserAttrs,
      conversationId: string
    }>
{
  constructor(private _io: SocketServer) {}

  handle({
    userRemoved,
    removedBy,
    conversationId,
  }: {
    userRemoved: UserAttrs,
    removedBy: UserAttrs,
    conversationId: string
  }): void {
    this._io.emit(
      "participant-removed",
      userRemoved,
      removedBy,
      conversationId
    );
  }
}
