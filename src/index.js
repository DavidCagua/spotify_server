const axios = require("axios");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const app = express();
const redis = require("redis");
const jsonParser = bodyParser.json();
app.use(cors());

const client = redis.createClient({
  url: process.env.REDIS_URL,
  no_ready_check: true,
  password: process.env.REDIS_PASSWORD,
});
app.post("/history", jsonParser, async (req, res) => {
  try {
    const song = req.body.song;
    await client.connect();
    await client.lPush("history", song);
    const response = await client.lRange("history", 0, 20);
    await client.disconnect();
    res.json(response.map((element) => JSON.parse(element)));
  } catch (e) {
    console.log(e);
  }
});

app.get("/history", async (req, res) => {
  try {
    await client.connect();
    const response = await client.lRange("history", 0, 20);
    await client.disconnect();
    res.json(response.map((element) => JSON.parse(element)));
  } catch (e) {
    console.log(e);
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
