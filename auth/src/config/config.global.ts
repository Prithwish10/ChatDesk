// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (!process.env) {
  throw new Error('.env file missing');
}
if (!process.env.MONGO_URL) {
  throw new Error('Mongodb URL must be defined');
}
if (!process.env.DB_NAME) {
  throw new Error('Database name must be defined');
}
if (!process.env.NATS_URL) {
  throw new Error('NATS URL must be defined');
}
if (!process.env.NATS_CLUSTER_ID) {
  throw new Error('NATS Client Id must be defined');
}
if (!process.env.NATS_CLUSTER_ID) {
  throw new Error('NATS Cluster Id must be defined');
}
if (!process.env.REDIS_URL) {
  throw new Error('Redis URL must be defined');
}

export default {
  servicename: 'auth',
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
    },
    redis: {
      redisURL: process.env.REDIS_URL,
      redisPort: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
  },

  jwtSecret: process.env.JWT_KEY,

  /**
   * OTP configuration
   */
  otp: {
    /** TTL for a stored OTP in seconds (10 minutes) */
    ttlSeconds:
      10 * 60 /** Maximum consecutive failed verification attempts before the OTP is invalidated */,
    maxAttempts: 5 /** Maximum OTP send requests allowed per recipient within the rate-limit window */,
    maxOtpRequestsPerWindow: 3 /** Duration of the rate-limit window in seconds */,
    rateLimitWindowSeconds: 60,
  },

  /**
   * API configs
   */
  api: {
    prefix: process.env.API_PREFIX || '/api',
    version: process.env.API_VERSION || '/v1',
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
};
