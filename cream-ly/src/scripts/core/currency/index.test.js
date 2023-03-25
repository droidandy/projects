import * as currency from ".";

describe("currency suite", () => {
  it("converts price correctly", async () => {
    const price = 100;
    const rate = 2;

    const result = currency.convertPrice(price, rate);

    expect(result).toBe(200);
  });
});
