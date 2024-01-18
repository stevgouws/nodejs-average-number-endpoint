import { randomNumberService } from "./services/randomNumberService.js";

export class Monitor {
  frequency = 250;

  interval;

  randomNumbersCollectedCount = 0;

  currentAverage = 0;

  async start() {
    console.log("Starting monitor");
    this.interval = setInterval(async () => {
      const randomNumber = await randomNumberService.getRandomNumber();
      if (typeof randomNumber !== "number") {
        console.log(`number is ${randomNumber}, skipping...`);
        return;
      }
      console.log(`Adding ${randomNumber}`);
      const previousSum =
        this.currentAverage * this.randomNumbersCollectedCount;
      this.randomNumbersCollectedCount += 1;
      this.currentAverage =
        (previousSum + randomNumber) / this.randomNumbersCollectedCount;
      console.log("this.currentAverage", this.currentAverage);
    }, this.frequency);
  }

  stop() {
    console.log("Stopping monitor");
    clearInterval(this.interval);
  }
}
