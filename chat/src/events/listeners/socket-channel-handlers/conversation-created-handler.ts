import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";
import { Participant } from "../../../interfaces/v1/Participant";

export class CreateConversationHandler implements ChannelHandler {
  constructor(private _io: SocketServer) {}

  handle({ participants, conversationId }: any): void {
    participants.forEach((participant: Participant) => {
      this._io
        .to(participant.user_id.toString())
        .emit("new-conversation", conversationId);
    });
  }
}
