const { createClient } = require("redis");
const env = require("./env");

const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    keepAlive: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error("Redis reconnect failed");
      return Math.min(retries * 200, 3000);
    },
  },
});

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("reconnecting", () => console.log("Redis reconnecting..."));
redisClient.on("error", (err) =>
  console.error("Redis error:", err.message)
);

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
