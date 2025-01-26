import 'reflect-metadata';
import { Application } from 'express';
import http from 'http';
import DatabaseManager from './loaders/DatabaseManager';
import { logger } from './loaders/logger';
import config from './config/config.global';
import { natsWrapper } from './loaders/NatsWrapper';
import createApp from './loaders/app';
import { HighPriorityNotificationSentListener } from './events/listeners/high-priority-notification-sent-listener';
import { MediumPriorityNotificationSentListener } from './events/listeners/medium-priority-notification-sent-listener';
import { LowPriorityNotificationSentListener } from './events/listeners/low-priority-notification-sent-listener';

/**
 * Represents a server that listens on a specified port and handles HTTP requests.
 */
class Server {
  private readonly _app: Application;
  private readonly _port: number;
  private readonly _dbConnection: DatabaseManager;
  private _server!: http.Server;

  /**
   * Creates a new Server instance.
   * @param port - The port number on which the server will listen.
   * @param dbConnection - The database connection object.
   */
  constructor(port: number, dbConnection: any) {
    this._app = createApp();
    this._port = port;
    this._dbConnection = dbConnection;
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
        config.connections.nats.natsURL!,
      );

      natsWrapper.client.on('close', () => {
        logger.info('⛔ NATS connection closed! ⛔');
        process.exit();
      });
      process.on('SIGINT', () => natsWrapper.client.close());
      process.on('SIGTERM', () => natsWrapper.client.close());

      new HighPriorityNotificationSentListener(natsWrapper.client).listen();
      new MediumPriorityNotificationSentListener(natsWrapper.client).listen();
      new LowPriorityNotificationSentListener(natsWrapper.client).listen();

      this._server = this._app
        .listen(this._port, async () => {
          logger.info(`
        ################################################
        🛡️  Server listening on port: ${this._port} 🛡️
        ################################################
      `);
          await this._dbConnection.connect();
        })
        .on('error', (err) => {
          logger.error(`${err}`);
          process.exit(1);
        });

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

      if (this._server) {
        promises.push(
          new Promise<void>((resolve, reject) => {
            this._server.close((err?: Error) => {
              if (err) {
                logger.error(`Error while closing server: ${err.message} :error`);
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
          }),
        );
      }

      if (this._dbConnection) {
        promises.push(this._dbConnection.disconnect());
        logger.info('⛔ Database connection closed. ⛔');
      }

      await Promise.all(promises);
      logger.info('⛔ Shutdown process completed. ⛔');
      process.exit(0);
    } catch (error) {
      logger.error(`Error during shutdown process: ${error}`);
      process.exit(1);
    }
  }

  /**
   * Binds POSIX signals (SIGINT and SIGTERM) to trigger the graceful shutdown process.
   * When either SIGINT or SIGTERM is received, the `shutdown` method is called.
   */
  private bindPOSIXSignals() {
    process.on('SIGINT', async () => this.shutdown());
    process.on('SIGTERM', async () => this.shutdown());
  }
}

export default Server;
