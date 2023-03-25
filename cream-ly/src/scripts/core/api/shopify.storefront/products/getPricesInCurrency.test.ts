//@ts-nocheck
import getPricesInCurrency from "./getPricesInCurrency";
import fixtureGraphqlResponse from "./cache/variantPrices.json";

describe("Shopify Storefront getPricesInCurrency", () => {
  beforeEach(() => {
    fetchMock.doMock();
  });
  it("getPricesInCurrency", async () => {
    const currencyCode = "RUB";
    fetchMock.once(JSON.stringify(fixtureGraphqlResponse));
    const result = await getPricesInCurrency(currencyCode);
  });
});
