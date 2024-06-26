import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (!process.env) {
  throw new Error(".env file missing");
}

export default {
  servicename: 'common',
  jwtSecret: process.env.JWT_KEY,

  /**
   * Used by winston logger
   */
  logs: {
    logglyCustomerToken: process.env.LOGGLY_TOKEN,
    logglyDomain: process.env.LOGGLY_DOMAIN,
    level: process.env.LOG_LEVEL || "silly",
  },
};
