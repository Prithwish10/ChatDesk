process.env.JWT_KEY = 'asdfabcd';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.MONGO_URL = 'asdf';
process.env.DB_NAME = 'asdf';
process.env.NATS_URL = 'asdf';
process.env.NATS_CLUSTER_ID = 'asdf';
process.env.NATS_CLUSTER_ID = 'asdf';
process.env.REDIS_URL = 'redis://localhost:6379';
export default {
  jwtSecret: 'asdfabcd',
  connections: {
    mongodb: {
      databaseURL: 'asdf',
      databaseName: 'asdf',
    },
    nats: {
      natsURL: 'asdf',
      natsClusterId: 'asdf',
      natsClientId: 'test-client',
    },
    redis: {
      redisURL: 'redis://localhost:6379',
    },
  },
  otp: {
    ttlSeconds: 600,
    maxAttempts: 5,
    maxOtpRequestsPerWindow: 3,
    rateLimitWindowSeconds: 60,
  },
  api: {
    prefix: process.env.API_PREFIX || '/api',
    version: process.env.API_VERSION || '/v1',
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
};
