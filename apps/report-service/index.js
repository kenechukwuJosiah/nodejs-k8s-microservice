const express = require("express");
const Redis = require("ioredis");

const app = express();
app.use(express.json());

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis-release-master",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

const USER_ACTIONS_KEY = "user:actions";

const router = express.Router();

// Get Recent User Actions
router.get("/recent-actions", async (req, res) => {
  const actions = await redis.lrange(USER_ACTIONS_KEY, 0, 9); // Get last 10 actions
  res.json({ message: "Recent user actions", actions });
});

// Clear Actions (for testing)
router.delete("/clear-actions", async (req, res) => {
  await redis.del(USER_ACTIONS_KEY);
  res.json({ message: "All user actions cleared" });
});

// Health Check
router.get("/", (req, res) => res.send("Report Service Running"));

app.use("/report", router);

// Start Server
app.listen(4000, () => console.log("Report Service running on port 4000"));
