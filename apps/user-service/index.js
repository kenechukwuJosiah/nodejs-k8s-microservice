const express = require("express");
const Redis = require("ioredis");

const app = express();
app.use(express.json());

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis-release-master",
  port: process.env.REDIS_PORT || 6379,
});

const USER_ACTIONS_KEY = "user:actions";

// Login Endpoint
app.post("/login", async (req, res) => {
  const { username } = req.body;
  const action = `User ${username} logged in at ${new Date().toISOString()}`;
  
  await redis.lpush(USER_ACTIONS_KEY, action);  // Store in Redis list
  res.json({ message: "Login successful", action });
});

// Update Profile Endpoint
app.post("/update-profile", async (req, res) => {
  const { username, changes } = req.body;
  const action = `User ${username} updated profile: ${JSON.stringify(changes)} at ${new Date().toISOString()}`;
  
  await redis.lpush(USER_ACTIONS_KEY, action);
  res.json({ message: "Profile updated", action });
});

// Health Check
app.get("/", (req, res) => res.send("User Service Running"));

// Start Server
app.listen(3000, () => console.log("User Service running on port 3000"));
