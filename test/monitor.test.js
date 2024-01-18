import { expect } from "chai";
import { describe, it, before, after, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import { Monitor } from "../app/Monitor.js";
import { randomNumberService } from "../app/services/randomNumberService.js";

describe("monitor", () => {
  describe("given that the monitor is run", () => {
    const monitor = new Monitor();
    let clock;
    before(async () => {
      clock = sinon.useFakeTimers();
      const randomNumberServiceStub = sinon.stub(
        randomNumberService,
        "getRandomNumber"
      );
      randomNumberServiceStub.onCall(0).returns(10);
      randomNumberServiceStub.onCall(1).returns(20);
      await monitor.start();
    });
    after(async () => {
      clock.restore();
      sinon.restore();
    });
    it("should not update the average in less than a second", async () => {
      await clock.tickAsync(500);
      expect(monitor.currentAverage).to.be.undefined;
    });
    it("should update the average after a second", async () => {
      await clock.tickAsync(500);
      expect(monitor.currentAverage).to.equal(10);
    });
    it("should continue to update the average after every subsequent second", async () => {
      await clock.tickAsync(1000);
      expect(monitor.currentAverage).to.equal(15);
    });
  });

  describe("given that a wide range of numbers are provided by the random number service", () => {
    const monitor = new Monitor();
    let clock;
    const range = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // average 55
    beforeEach(async () => {
      clock = sinon.useFakeTimers();
      const randomNumberServiceStub = sinon.stub(
        randomNumberService,
        "getRandomNumber"
      );
      range.forEach((number, index) => {
        randomNumberServiceStub.onCall(index).returns(number);
      });
      await monitor.start();
    });
    afterEach(async () => {
      clock.restore();
      sinon.restore();
    });
    it("should update the average to the average of the entire range", async () => {
      await clock.tickAsync(1000 * range.length);
      expect(monitor.currentAverage).to.equal(55);
    });
  });

  describe("given that the random number service doesn't return a number", () => {
    const monitor = new Monitor();
    let clock;
    const range = [undefined, 10, 20]; // average 15
    beforeEach(async () => {
      clock = sinon.useFakeTimers();
      const randomNumberServiceStub = sinon.stub(
        randomNumberService,
        "getRandomNumber"
      );
      range.forEach((number, index) => {
        randomNumberServiceStub.onCall(index).returns(number);
      });
      await monitor.start();
    });
    afterEach(async () => {
      clock.restore();
      sinon.restore();
    });
    it("should ignore that value from the calculation", async () => {
      await clock.tickAsync(1000 * range.length);
      expect(monitor.currentAverage).to.equal(15);
    });
  });
});
