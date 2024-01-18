import { randomNumberService } from "./services/randomNumberService.js";

export class Monitor {
  frequency = 250;

  interval;

  randomNumbers = [];

  currentAverage;

  async start() {
    console.log("Starting monitor");
    this.interval = setInterval(async () => {
      const randomNumber = await randomNumberService.getRandomNumber();
      if (typeof randomNumber !== "number") {
        console.log(`number is ${randomNumber}, skipping...`);
        return;
      }
      console.log(`Adding ${randomNumber}`);
      this.randomNumbers.push(randomNumber);
      this.currentAverage =
        this.randomNumbers.reduce((memo, number) => memo + number, 0) /
        this.randomNumbers.length;
      console.log("this.currentAverage", this.currentAverage);
    }, this.frequency);
  }

  stop() {
    console.log("Stopping monitor");
    clearInterval(this.interval);
  }
}
