import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";

export class WelcomeMessageHandler implements ChannelHandler {
  constructor(private _io: SocketServer) {}

  handle({message} : any): void {
    this._io.emit("welcome-message", message);
  }
}
