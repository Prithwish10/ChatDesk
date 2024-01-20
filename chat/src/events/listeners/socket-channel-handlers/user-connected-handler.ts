import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";
import { UserAttrs } from "../../../interfaces/v1/User";

export class UserConnectedHandler implements ChannelHandler<UserAttrs> {
  constructor(private _io: SocketServer) {}

  handle(user: UserAttrs): void {
    logger.info(`Subscribing: ${JSON.stringify(user)}`);
    this._io.emit("user-connected", user);
  }
}
