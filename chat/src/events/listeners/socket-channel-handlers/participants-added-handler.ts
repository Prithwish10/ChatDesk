import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";
import { UserAttrs } from "../../../interfaces/v1/User";

export class ParticipantAddedHandler
  implements
    ChannelHandler<{
      userAdded: UserAttrs,
      addedBy: UserAttrs,
      conversationId: string
    }>
{
  constructor(private _io: SocketServer) {}

  handle({
    userAdded,
    addedBy,
    conversationId,
  }: {
    userAdded: UserAttrs,
    addedBy: UserAttrs,
    conversationId: string
  }): void {
    this._io.emit("participant-added", userAdded, addedBy, conversationId);
  }
}
