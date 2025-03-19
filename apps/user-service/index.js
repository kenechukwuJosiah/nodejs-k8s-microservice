const express = require("express");
const Redis = require("ioredis");

const app = express();
app.use(express.json());

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis-master",
  port: process.env.REDIS_PORT || 6379,
});

const USER_ACTIONS_KEY = "user:actions";

const userRouter = express.Router();

// Login Endpoint
userRouter.post("/login", async (req, res) => {
  const { username } = req.body;
  const action = `User ${username} logged in at ${new Date().toISOString()}`;
  
  await redis.lpush(USER_ACTIONS_KEY, action);
  res.json({ message: "Login successful", action });
});

// Update Profile Endpoint
userRouter.post("/update-profile", async (req, res) => {
  const { username, changes } = req.body;
  const action = `User ${username} updated profile: ${JSON.stringify(changes)} at ${new Date().toISOString()}`;
  
  await redis.lpush(USER_ACTIONS_KEY, action);
  res.json({ message: "Profile updated", action });
});

// Health Check
app.get("/", (req, res) => res.send("User Service Running"));

// Mount the userRouter on /users
app.use("/users", userRouter);

// Start Server
app.listen(4100, () => console.log("User Service running on port 4100"));
