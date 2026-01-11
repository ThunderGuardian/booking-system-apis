const { Redis } = require("ioredis");

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
};

const redis = new Redis(connection);
redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", err => {
  console.error("Redis error:", err);
});

module.exports = {
  redis,
  connection
};
