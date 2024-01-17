import express from "express";
import { Monitor } from "./Monitor.js";

const app = express();
const port = 3000;
const monitor = new Monitor();

app.listen(port, async () => {
  console.log(`✅ Average number app is listening on port ${port}`);
  await monitor.start();
});

app.get("/average", (req, res) => {
  res.json({ currentAverage: monitor.currentAverage });
});
