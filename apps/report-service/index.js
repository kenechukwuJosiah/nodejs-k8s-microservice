const express = require("express");
const Redis = require("ioredis");
const { Client } = require("pg");

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

router.get("/store-random-data", async (req, res) => {
  const randomData = Math.random().toString(36).substring(7);
  try {
    await pgClient.query("INSERT INTO random_data_table(data) VALUES($1)", [randomData]);
    res.json({ message: "Random data stored", data: randomData });
  } catch (err) {
    console.error("Error storing data", err.stack);
    res.status(500).json({ message: "Error storing data" });
  }
});
// Clear Actions (for testing)
router.delete("/clear-actions", async (req, res) => {
  await redis.del(USER_ACTIONS_KEY);
  res.json({ message: "All user actions cleared" });
});

// Health Check
router.get("/", (req, res) => res.send("Report Service Running"));

app.use("/report", router);

console.log(`${process.env.TEST_PASSWORD}`);
console.log(`${process.env.TEST_TOKEN}`);

// Start Server
app.listen(process.env.APP_PORT, () => console.log(`REPORT Service running on port ${process.env.APP_PORT}`));
