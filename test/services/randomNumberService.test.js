import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import { randomNumberService } from "../../app/services/randomNumberService.js";

describe("getRandomNumber", () => {
  describe("given that the request to fetch a number succeeds", () => {
    const number = 50;
    beforeEach(async () => {
      sinon
        .stub(global, "fetch")
        .resolves({ ok: true, json: () => [{ random: number }] });
    });
    afterEach(async () => {
      sinon.restore();
    });
    it("should return a number", async () => {
      const result = await randomNumberService.getRandomNumber();
      expect(result).to.equal(number);
    });
  });
  describe("given that the request to fetch a number fails", () => {
    beforeEach(async () => {
      sinon.stub(global, "fetch").rejects(new Error("Kaboom!"));
    });
    afterEach(async () => {
      sinon.restore();
    });
    it("should return undefined", async () => {
      const result = await randomNumberService.getRandomNumber();
      expect(result).to.be.undefined;
    });
  });
  describe("given that the request has an HTTP error", () => {
    beforeEach(async () => {
      sinon.stub(global, "fetch").resolves({ ok: false, status: 500 });
    });
    afterEach(async () => {
      sinon.restore();
    });
    it("should return undefined", async () => {
      const result = await randomNumberService.getRandomNumber();
      expect(result).to.be.undefined;
    });
  });
});
