const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const apiRoutes = require("./routes");
const { redisClient } = require("./config/redis");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.post("/clear-cache", async (req, res) => {
  await redisClient.flushDb();
  res.json({ message: "Cache cleared" });
});

app.use("/api", apiRoutes);

module.exports = app;
