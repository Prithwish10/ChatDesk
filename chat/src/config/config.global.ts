import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// const envFound = dotenv.config();

// if (envFound.error) {
//   throw new Error("Couldn't find .env file");
// }
if (!process.env) {
  throw new Error("environment variables are missing");
}

export default {
  servicename: 'chat',
  port: process.env.PORT || 3000,

  /**
   * Database connection
   */
  connections: {
    mongodb: {
      databaseURL: process.env.MONGO_URL || "mongodb://chat-mongo-srv:27017",
      databaseName: process.env.DB_NAME || "chat",
    },
  },

  jwtSecret: process.env.JWT_KEY,

  /**
   * API configs
   */
  api: {
    prefix: process.env.API_PREFIX || "/api",
    version: process.env.API_VERSION || "/v1",
  },

  socket: {
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:4000",
    pingTimeout: process.env.PING_TIMEOUT || 60000,
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
};
