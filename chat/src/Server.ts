import "reflect-metadata";
import express, { Application } from "express";
import http from "http";
import { logger } from "./loaders/logger";
import DatabaseManager from "./loaders/DatabaseManager";
import config from "./config/config.global";
import ChatServer from "./socket/ChatServer";
import { natsWrapper } from "./loaders/NatsWrapper";
import { UserCreatedListener } from "./events/listeners/user-created-listener";
import { UserUpdatedListener } from "./events/listeners/user-updated-listener";
import { MessageCreatedListener } from "./events/listeners/message-created-listener";
import Presence from "./services/Presence";

/**
 * Represents a server that listens on a specified port and handles HTTP requests.
 */
class Server {
  private readonly _app: Application;
  private readonly _port: number;
  private readonly _dbConnection: DatabaseManager;
  private server!: http.Server;
  private _chatServer: ChatServer;
  private _presence: Presence;

  /**
   * Creates a new Server instance.
   *
   * @param {number} port - The port number on which the server should listen.
   * @param {any} dbConnection - The database connection instance.
   * @param {Presence} presence - The presence manager instance for handling user presence.
   *
   * @throws {Error} Throws an error if there is an issue configuring middlewares and routes.
   */
  constructor(port: number, dbConnection: any, presence: Presence) {
    this._app = express();
    this._port = port;
    this._dbConnection = dbConnection;
    this._presence = presence;
    this.configureMiddlewaresAndRoutes(this._app);
  }

  /**
   * Configures the middlewares and routes for the server's Express application.
   * @param app - The Express application object.
   */
  private async configureMiddlewaresAndRoutes(app: Application): Promise<void> {
    await require("./loaders/express").default({ app });
  }

  /**
   * Configures the socket server for handling chat functionality.
   * Initializes a new instance of ChatServer, configures socket events,
   * and associates it with the current server instance and presence manager.
   *
   * @throws {Error} Throws an error if there is an issue initializing the ChatServer.
   *
   * @returns {void} Returns nothing. The method initializes and configures the ChatServer instance.
   */
  private configureSocketServer(): void {
    this._chatServer = new ChatServer(
      this.server,
      config.socketOptions,
      this._presence
    );
    this._chatServer.configureSocketEvents();
  }

  /**
   * Starts the server by establishing connections and setting up event listeners.
   *
   * @throws {Error} Throws an error if there is an issue during the startup process.
   *
   * @returns {Promise<void>} Resolves when the server is successfully started.
   */
  public async up(): Promise<void> {
    try {
      await natsWrapper.connect(
        config.connections.nats.natsClusterId!,
        config.connections.nats.natsClientId!,
        config.connections.nats.natsURL!
      );

      natsWrapper.client.on("close", () => {
        logger.info("⛔ NATS connection closed! ⛔");
        process.exit();
      });
      process.on("SIGINT", () => natsWrapper.client.close());
      process.on("SIGTERM", () => natsWrapper.client.close());

      new UserCreatedListener(natsWrapper.client).listen();
      new UserUpdatedListener(natsWrapper.client).listen();
      new MessageCreatedListener(natsWrapper.client).listen();

      this.server = this._app
        .listen(this._port, async () => {
          logger.info(`
        ################################################
        🛡️  Server listening on port: ${this._port} 🛡️
        ################################################
      `);
          await this._dbConnection.connect();
        })
        .on("error", (err) => {
          logger.error(`${err}`);
          process.exit(1);
        });

      this.configureSocketServer();

      this.bindPOSIXSignals();
    } catch (error: any) {
      logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * Gracefully shuts down the server by closing the server and database connections.
   * Logs a message indicating that all services are shutdown.
   *
   * @returns {Promise<void>} Resolves when the server is successfully stopped.
   */
  public async shutdown(): Promise<void> {
    try {
      const promises = [];

      if (this.server) {
        promises.push(
          new Promise<void>((resolve, reject) => {
            this.server.close((err?: Error) => {
              if (err) {
                logger.error(
                  `Error while closing server: ${err.message} :error`
                );
                reject(err);
              } else {
                logger.info(`
                ################################################
                ⛔  Server shutdown!! ⛔
                ################################################
              `);
              }
              resolve();
            });
          })
        );
      }

      if (this._dbConnection) {
        promises.push(this._dbConnection.disconnect());
        logger.info("⛔ Database connection closed. ⛔");
      }

      if (this._presence) {
        promises.push(this._presence.quit());
        logger.info("⛔ Presence service quit. ⛔");
      }

      await Promise.all(promises);
      logger.info("⛔ Shutdown process completed. ⛔");
      process.exit(0);
    } catch (error) {
      logger.error(`Error during shutdown process: ${error}`);
      process.exit(1);
      // throw new Error("Failed to complete shutdown process.");
    }
  }

  /**
   * Binds POSIX signals (SIGINT and SIGTERM) to trigger the graceful shutdown process.
   * When either SIGINT or SIGTERM is received, the `shutdown` method is called.
   */
  private bindPOSIXSignals() {
    process.on("SIGINT", async () => this.shutdown());
    process.on("SIGTERM", async () => this.shutdown());
  }
}

export default Server;
