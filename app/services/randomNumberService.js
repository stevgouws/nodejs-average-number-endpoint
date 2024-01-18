class RandomNumberService {
  async getRandomNumber() {
    try {
      const response = await fetch(
        "https://csrng.net/csrng/csrng.php?min=0&max=100"
      );
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      const [result] = await response.json();
      return result.random;
    } catch (error) {
      console.log("error", error);
      return undefined;
    }
  }
}

export const randomNumberService = new RandomNumberService();
