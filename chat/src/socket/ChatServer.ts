import { Server as SocketServer, Socket } from "socket.io";
import { createAdapter } from "socket.io-redis";
import { logger } from "../loaders/logger";
import { Inject } from "typedi";
import { ConversationRepository } from "../repositories/v1/Conversation.repository";
import { Participant } from "../interfaces/v1/Participant";
import { UserAttrs } from "../interfaces/v1/User";
import CacheManager from "../services/CacheManager.service";

class ChatServer {
  private _io: SocketServer;
  private _cacheManager: CacheManager;
  @Inject()
  private _conversationRepository: ConversationRepository;

  constructor(
    server: any,
    socketOptions: any,
    cacheManager: CacheManager
  ) {
    this._io = new SocketServer(server, socketOptions);

    this._cacheManager = cacheManager;
    const redisClient = this._cacheManager.getClient();
    const pubSubClient = redisClient.duplicate();

    // Configure Socket.IO to use the Redis adapter
    this._io.adapter(
      createAdapter({ pubClient: pubSubClient, subClient: pubSubClient })
    );
  }

  public configureSocketEvents(): void {
    this._io.on("connection", (socket: Socket) => {
      logger.info(`User connected: ${socket.id}`);

      // Add the user to the list of active users
      socket.on("add-user", (user: UserAttrs) => {
        (socket as any).user = user;
        socket.emit("connected");
      });

      // Create a new conversation
      socket.on(
        "create-conversation",
        (conversationId: string, participants: Participant[]) => {
          // Inform every participants about the new conversation and share the conversationId
          participants.forEach((participant: Participant) => {
            socket
              .to(participant.user_id.toString())
              .emit("new-conversation", conversationId);
          });
        }
      );

      socket.on("get-conversation-list", async (conversationId: string) => {
        const conversation = await this._conversationRepository.getById(
          conversationId
        );
        const participants = conversation?.participants;

        if (!participants || participants.length === 0) {
          return;
        }

        // Emit the updated conversation order to all participants of the conversation
        for (
          let participant = 0;
          participant < participants.length;
          participant++
        ) {
          const conversations =
            await this._conversationRepository.getUserConversations(
              participants[participant].user_id.toString()
            );
          // Get the userSocketId from the Redis store
          const userSocketId = "123";
          socket.to(userSocketId).emit("get-conversation-list", conversations);
        }
      });

      socket.on("join-conversation", (conversation_id: string, callback) => {
        socket.join(conversation_id);
        logger.info(`User joined conversation: ${conversation_id}`);
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
          this._conversationRepository.updateParticipantsLastCheckedTimeByConversationId(
            conversation_id,
            user_id
          );
        }
      );

      socket.on("disconnect", () => {
        logger.info(`User disconnected: ${socket.id}`);
      });
    });
  }
}

export default ChatServer;
