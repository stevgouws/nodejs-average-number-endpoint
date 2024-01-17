import { expect } from "chai";
import { describe, it, before, after } from "mocha";
import sinon from "sinon";
import { monitor } from "../app/monitor.js";
import { randomNumberService } from "../app/services/randomNumberService.js";

describe("monitor", () => {
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
