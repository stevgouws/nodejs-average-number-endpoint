import { randomNumberService } from "./services/randomNumberService.js";
import { logger } from "./services/loggerService.js";

export class Monitor {
  frequency = 250;

  interval;

  randomNumbersCollectedCount = 0;

  currentAverage = 0;

  async start() {
    logger.info(`Starting monitor, running at ${this.frequency}ms intervals`);
    this.interval = setInterval(async () => {
      const randomNumber = await randomNumberService.getRandomNumber();
      logger.trace(`received ${randomNumber}`);
      if (typeof randomNumber !== "number") {
        logger.trace(
          `number is ${randomNumber} instead of a number, skipping...`
        );
        return;
      }
      const previousSum =
        this.currentAverage * this.randomNumbersCollectedCount;
      this.randomNumbersCollectedCount += 1;
      this.currentAverage =
        (previousSum + randomNumber) / this.randomNumbersCollectedCount;
      logger.trace(`currentAverage updated to: ${this.currentAverage}`);
    }, this.frequency);
  }

  stop() {
    logger.info("Stopping monitor");
    clearInterval(this.interval);
  }
}
