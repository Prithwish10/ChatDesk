import { Server as SocketServer } from "socket.io";
import { logger } from "../../../loaders/logger";
import { ChannelHandler } from "../../../interfaces/v1/ChannelHandler";
import { UserAttrs } from "../../../interfaces/v1/User";

export class ConnectedUsersHandler implements ChannelHandler<UserAttrs[]> {
  constructor(private _io: SocketServer) {}

  handle(connectedUsers: UserAttrs[]): void {
    this._io.emit("connected-users", connectedUsers);
  }
}
