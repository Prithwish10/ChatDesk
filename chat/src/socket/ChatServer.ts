import { Server as SocketServer, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { logger } from "../loaders/logger";
import { Inject } from "typedi";
import { ConversationRepository } from "../repositories/v1/Conversation.repository";
import { Participant } from "../interfaces/v1/Participant";
import { UserAttrs } from "../interfaces/v1/User";
import CacheManager from "../services/CacheManager.service";
// import { Socket } from "../interfaces/v1/Socket";

declare module "socket.io" {
  interface Socket {
    user: UserAttrs; // Replace 'string' with the appropriate data type for 'user'
  }
}

class ChatServer {
  private _io: SocketServer;
  private _cacheManager: CacheManager;
  @Inject()
  private _conversationRepository: ConversationRepository;

  constructor(server: any, socketOptions: any, cacheManager: CacheManager) {
    this._io = new SocketServer(server, socketOptions);

    this._cacheManager = cacheManager;
    const redisClient = this._cacheManager.getClient();

    // Setup socket.io to scale horizontally using Redis pubsub
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();

    // Configure Socket.IO to use the Redis adapter
    this._io.adapter(createAdapter(pubClient, subClient));
  }

  public configureSocketEvents(): void {
    this._io.on("connection", (socket: Socket) => {
      logger.info(`User connected: ${socket.id}`);

      // Welcome current user
      socket.emit("welcome-message", "Welcome to Chatdesk!");

      // Add the user to the list of active users
      socket.on("add-user", async (user: UserAttrs) => {
        logger.info(`UserId: ${user._id}`);
        await this._cacheManager.upsert(user._id.toString(), socket.id);

        socket.user = user;

        logger.info(`User Added: ${socket.user}`);

        // group sockets based on the user's userId.
        // This is beneficial because a user can have multiple devices or sessions, and we want to send the message to all of their connected sockets (devices).
        socket.join(user._id.toString());

        // Get the list of connected users from the Redis cache.
        const connectedUsers = await this._cacheManager.getList();
        logger.info(`Connected users: ${connectedUsers}`);

        socket.emit("connected-users", connectedUsers);
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

          socket
            .to(participants[participant].user_id.toString())
            .emit("get-conversation-list", conversations);
        }
      });

      socket.on("join-conversation", (conversation_id: string, callback) => {
        socket.join(conversation_id);
        logger.info(`User joined conversation: ${conversation_id}`);
        callback("Joined");
      });

      socket.on(
        "send-message",
        async (message: string, conversationId: string, callback) => {
          // Emit the message to the room with the identifier 'conversationId'.
          socket.to(conversationId).emit("receive-message", message);

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

            // Emit the conversation list of all the rooms with the identifier UserId (since you have done socket.join(userId)).
            socket
              .to(participants[participant].user_id.toString())
              .emit("get-conversation-list", conversations);
          }

          callback("sent");
        }
      );

      socket.on("typing", (conversation_id) =>
        socket.in(conversation_id).emit("typing")
      );

      socket.on("stop-typing", (conversation_id) =>
        socket.in(conversation_id).emit("stop-typing")
      );

      socket.conn.on("heartbeat", async () => {
        if(!socket.user) {
          return;
        }
        await this._cacheManager.upsert(socket.id, socket.user._id.toString());
      });

      socket.on(
        "last-checked-conversation",
        (conversation_id: string, user_id: string) => {
          this._conversationRepository.updateParticipantsLastCheckedTimeByConversationId(
            conversation_id,
            user_id
          );
        }
      );

      socket.on("disconnect", async () => {
        logger.info(`User disconnected with socketId ${socket.id}: ${socket.user}`);

        // socket.leave(userData._id);
        if(socket.user) {
          await this._cacheManager.remove(socket.id);
          const connectedUsers = await this._cacheManager.getList()

          socket.emit("connected-users", connectedUsers);

          socket.leave(socket.user._id.toString());
        }
      });
    });
  }
}

export default ChatServer;
