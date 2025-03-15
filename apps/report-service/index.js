const express = require("express");
const Redis = require("ioredis");

const app = express();
app.use(express.json());

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis-release-master",
  port: process.env.REDIS_PORT || 6379,
});

const USER_ACTIONS_KEY = "user:actions";

// Get Recent User Actions
app.get("/recent-actions", async (req, res) => {
  const actions = await redis.lrange(USER_ACTIONS_KEY, 0, 9); // Get last 10 actions
  res.json({ message: "Recent user actions", actions });
});

// Clear Actions (for testing)
app.delete("/clear-actions", async (req, res) => {
  await redis.del(USER_ACTIONS_KEY);
  res.json({ message: "All user actions cleared" });
});

// Health Check
app.get("/", (req, res) => res.send("Report Service Running"));

// Start Server
app.listen(4000, () => console.log("Report Service running on port 4000"));
