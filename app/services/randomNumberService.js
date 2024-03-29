import { logger } from "./loggerService.js";

class RandomNumberService {
  async getRandomNumber() {
    const rateLimitErrorCode = "5";
    try {
      logger.trace("fetching random number");
      const response = await fetch(
        "https://csrng.net/csrng/csrng.php?min=0&max=100"
      );
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      const [result] = await response.json();
      if (result.code === rateLimitErrorCode) {
        // no need to log error as we expect to hit the rate limit quite often
        return undefined;
      }
      if (result.status !== "success") {
        throw new Error(`API error: ${result.reason}`);
      }
      logger.trace(`received random number: ${result.random}`);
      return result.random;
    } catch (error) {
      logger.error(error);
      return undefined;
    }
  }
}

export const randomNumberService = new RandomNumberService();
