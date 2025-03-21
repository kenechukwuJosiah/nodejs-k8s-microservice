const express = require("express");
const Redis = require("ioredis");
const { Client } = require("pg");

const pgClient = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
});

pgClient.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Connection error", err.stack));

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

// Retrieve All Data Endpoint
userRouter.get("/data", async (req, res) => {
  try {
    const result = await pgClient.query("SELECT * FROM random_data_table");
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

// Health Check
userRouter.get("/", (req, res) => res.send("User Service Running"));

// Mount the userRouter on /users
app.use("/users", userRouter);

console.log(`${process.env.TEST_PASSWORD}`);
console.log(`${process.env.TEST_TOKEN}`);

// Start Server
app.listen(process.env.APP_PORT, () => console.log(`User Service running on port ${process.env.APP_PORT}`));
