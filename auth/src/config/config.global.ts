import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (!process.env) {
  throw new Error(".env file missing");
}
if (!process.env.MONGO_URL) {
  throw new Error("Mongodb URL must be defined");
}
if (!process.env.DB_NAME) {
  throw new Error("Database name must be defined");
}
if (!process.env.NATS_URL) {
  throw new Error("NATS URL must be defined");
}
if (!process.env.NATS_CLUSTER_ID) {
  throw new Error("NATS Client Id must be defined");
}
if (!process.env.NATS_CLUSTER_ID) {
  throw new Error("NATS Cluster Id must be defined");
}

export default {
  servicename: "auth",
  port: process.env.PORT || 3000,

  /**
   * Connection parameters
   */
  connections: {
    mongodb: {
      databaseURL: process.env.MONGO_URL,
      databaseName: process.env.DB_NAME,
    },
    nats: {
      natsURL: process.env.NATS_URL,
      natsClusterId: process.env.NATS_CLUSTER_ID,
      natsClientId: process.env.NATS_CLIENT_ID,
    }
  },

  jwtSecret: process.env.JWT_KEY,

  /**
   * API configs
   */
  api: {
    prefix: process.env.API_PREFIX || "/api",
    version: process.env.API_VERSION || "/v1",
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
};
