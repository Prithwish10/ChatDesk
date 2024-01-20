import { Server as SocketServer } from "socket.io";
import { logger } from "../../loaders/logger";
import { ChannelHandler } from "../../interfaces/v1/ChannelHandler";

export class UserConnectedHandler implements ChannelHandler {
  constructor(private _io: SocketServer) {}

  handle(data: any): void {
    logger.info(`Subscribing: ${JSON.stringify(data)}`);
    this._io.emit("user-connected", data);
  }
}
