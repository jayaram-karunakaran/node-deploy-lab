const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.send("healthy");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
