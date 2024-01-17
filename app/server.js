import express from "express";
import { monitor } from "./monitor.js";

const app = express();
const port = 3000;

app.listen(port, async () => {
  console.log(`✅ Average number app is listening on port ${port}`);
  await monitor.start();
});

app.get("/average", (req, res) => {
  res.json({ currentAverage: monitor.currentAverage });
});
