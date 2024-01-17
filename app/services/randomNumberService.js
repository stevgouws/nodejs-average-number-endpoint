class RandomNumberService {
  async getRandomNumber() {
    const response = await fetch(
      "https://csrng.net/csrng/csrng.php?min=0&max=100"
    );
    // SG_TODO handle errors
    const [result] = await response.json();
    return result.random;
  }
}

export const randomNumberService = new RandomNumberService();
