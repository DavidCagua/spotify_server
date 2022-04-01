const axios = require("axios");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const app = express();
const redis = require("redis");
const jsonParser = bodyParser.json();
app.use(cors());

const client = redis.createClient();
app.post("/history", jsonParser, async (req, res) => {
  try {
    const song = req.body.song;
    await client.connect();
    await client.lPush("history", song);
    await client.disconnect();
    res.end("ok");
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
app.listen(4000);
console.log("server listening");
