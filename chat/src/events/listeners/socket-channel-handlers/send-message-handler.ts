import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";
import { Participant } from "@pdchat/common/build/interfaces/Participant";
import { MessageAttrs } from "../../../interfaces/v1/Message";

export class SendMessageHandler
  implements ChannelHandler<{ participant: Participant, message: MessageAttrs }>
{
  constructor(private _io: SocketServer) {}

  handle({
    participant,
    message,
  }: {
    participant: Participant,
    message: MessageAttrs
  }): void {
    this._io
      .in(participant.user_id.toString())
      .emit("message-received", message);
  }
}
