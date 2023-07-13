import { Server as SocketServer, Socket } from "socket.io";
import { Logger } from "@pdchat/common";
import { Inject } from "typedi";
import { ConversationRepository } from "../repositories/v1/Conversation.repository";
import config from "../config/config.global";

class ChatServer {
  private io: SocketServer;
  private readonly _logger: Logger;
  @Inject()
  private conversationRepository: ConversationRepository;

  constructor(server: any, pingTimeout: number, corsOrigin: string) {
    this._logger = Logger.getInstance(config.servicename);
    this.io = new SocketServer(server, {
      pingTimeout,
      cors: {
        origin: corsOrigin,
      },
    });
  }

  public configureSocketEvents(): void {
    this.io.on("connection", (socket: Socket) => {
      this._logger.info(`User connected: ${socket.id}`);

      socket.on("add-user", (userId: string, username: string) => {});

      socket.on("join-conversation", (conversation_id: string, callback) => {
        socket.join(conversation_id);
        this._logger.info(`User joined conversation: ${conversation_id}`);
        callback("Joined");
      });

      socket.on(
        "send-message",
        (message: string, conversation_id: string, callback) => {
          socket.to(conversation_id).emit("receive-message", message);
          callback("sent");
        }
      );

      socket.on("typing", (conversation_id) =>
        socket.in(conversation_id).emit("typing")
      );

      socket.on("stop-typing", (conversation_id) =>
        socket.in(conversation_id).emit("stop-typing")
      );

      socket.on(
        "last-checked-conversation",
        (conversation_id: string, user_id: string) => {
          this.conversationRepository.updateParticipantsLastCheckedTime(
            conversation_id,
            user_id
          );
        }
      );

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
}

export default ChatServer;
