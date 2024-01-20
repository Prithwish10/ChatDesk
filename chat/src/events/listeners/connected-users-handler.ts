import { Server as SocketServer } from "socket.io";
import { logger } from "../../loaders/logger";
import { ChannelHandler } from "../../interfaces/v1/ChannelHandler";

export class ConnectedUsersHandler implements ChannelHandler {
  constructor(private _io: SocketServer) {}

  handle(connectedUsers: any): void {
    this._io.emit("connected-users", connectedUsers);
  }
}
