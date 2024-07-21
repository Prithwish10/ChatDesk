import config from './config/config.global';
import DatabaseManager from './loaders/DatabaseManager';
import Server from './Server';

// Run the services with default configuration
const server = new Server(
  Number.parseInt(config.port as string),
  DatabaseManager.getInstance(
    config.connections.mongodb.databaseURL as string,
    config.connections.mongodb.databaseName as string,
  ),
);

server.up();

export default server;
