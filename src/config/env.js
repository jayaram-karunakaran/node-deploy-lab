const { cleanEnv, str, port } = require("envalid");

const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  MONGO_URI: str(),
  JWT_SECRET: str(),
  REDIS_URL: str()
});

module.exports = env;
