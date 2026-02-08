require("dotenv").config();

const app = require("./src/app");
const { connectDB, connectRedis, env } = require("./src/config");

async function startServer() {
  try {
    await connectDB();

    try {
      await connectRedis();
    } catch (err) {
      console.warn("Redis unavailable. Running without cache.");
    }

    const server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });

    const shutdown = () => {
      console.log("Shutting down gracefully...");
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
}

startServer();
