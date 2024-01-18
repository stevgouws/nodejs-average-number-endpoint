import express from "express";
import { Monitor } from "./Monitor.js";
import { logger } from "./services/loggerService.js";

const app = express();
const port = 3000;
const monitor = new Monitor();

app.listen(port, async () => {
  logger.info(`✅ Average number app is listening on port ${port}`);
  await monitor.start();
});

app.get("/average", (req, res) => {
  res.json({ currentAverage: monitor.currentAverage });
});

process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", (error) => {
  logger.fatal(error);
  process.exit(1);
});
