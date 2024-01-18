import { expect } from "chai";
import { describe, it, before, after, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import { Monitor } from "../app/Monitor.js";
import { randomNumberService } from "../app/services/randomNumberService.js";

describe("monitor", () => {
  describe("given that the monitor is run", () => {
    const monitor = new Monitor();
    let clock;
    const range = [10, 20]; // average 15
    before(async () => {
      clock = sinon.useFakeTimers();
      stubGetRandomNumberToSequentiallyReturn(range);
      await monitor.start();
    });
    after(async () => {
      clock.restore();
      sinon.restore();
    });
    it(`should not update the average in less than ${monitor.frequency}ms`, async () => {
      await clock.tickAsync(monitor.frequency - 1);
      expect(monitor.currentAverage).to.equal(0);
    });

    it(`should update the average after ${monitor.frequency}ms`, async () => {
      await clock.tickAsync(monitor.frequency);
      expect(monitor.currentAverage).to.equal(10);
    });
    it(`should continue to update the average after every subsequent ${monitor.frequency}ms`, async () => {
      await clock.tickAsync(monitor.frequency);
      expect(monitor.currentAverage).to.equal(15);
    });
  });

  describe("given that a wide range of numbers are provided by the random number service", () => {
    const monitor = new Monitor();
    let clock;
    const range = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // average 55
    beforeEach(async () => {
      clock = sinon.useFakeTimers();
      stubGetRandomNumberToSequentiallyReturn(range);
      await monitor.start();
    });
    afterEach(async () => {
      clock.restore();
      sinon.restore();
    });
    it("should update the average to the average of the entire range", async () => {
      await clock.tickAsync(monitor.frequency * range.length);
      expect(monitor.currentAverage).to.equal(55);
    });
  });

  describe("given that the random number service doesn't return a number", () => {
    const monitor = new Monitor();
    let clock;
    const range = [undefined, 10, undefined, 20]; // average 15
    beforeEach(async () => {
      clock = sinon.useFakeTimers();
      stubGetRandomNumberToSequentiallyReturn(range);
      await monitor.start();
    });
    afterEach(async () => {
      clock.restore();
      sinon.restore();
    });
    it("should ignore those values from the calculation", async () => {
      await clock.tickAsync(monitor.frequency * range.length);
      expect(monitor.currentAverage).to.equal(15);
    });
  });
});

function stubGetRandomNumberToSequentiallyReturn(numbers) {
  const getRandomNumberStub = sinon.stub(
    randomNumberService,
    "getRandomNumber"
  );
  numbers.forEach((number, index) => {
    getRandomNumberStub.onCall(index).returns(number);
  });
}
