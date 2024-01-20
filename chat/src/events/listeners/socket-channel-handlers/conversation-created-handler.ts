import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";
import { Participant } from "../../../interfaces/v1/Participant";

export class CreateConversationHandler
  implements
    ChannelHandler<{ participants: Participant[]; conversationId: string }>
{
  constructor(private _io: SocketServer) {}

  handle({
    participants,
    conversationId,
  }: {
    participants: Participant[];
    conversationId: string;
  }): void {
    participants.forEach((participant: Participant) => {
      this._io
        .to(participant.user_id.toString())
        .emit("new-conversation", conversationId);
    });
  }
}
