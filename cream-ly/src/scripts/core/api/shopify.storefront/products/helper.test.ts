//@ts-nocheck
import * as Helper from "./helper";

const fixtureVariantWithPresentmentPrices: Shopify.Storefront.IProductVariantNode = {
  presentmentPrices: {
    edges: [
      {
        node: {
          price: { amount: "100", currencyCode: "EUR" },
        },
      },
      {
        node: {
          price: { amount: "50", currencyCode: "USD" },
        },
      },
    ],
  },
};

describe("Shopify Storefront Products", () => {
  it("gets presentment currency for variant", async () => {
    expect(
      Helper.getVariantPriceForCurrency(
        fixtureVariantWithPresentmentPrices,
        "EUR"
      )
    ).toBe(100);
  });

  it("gets presentment currency for variant", async () => {
    expect(
      Helper.getVariantPriceForCurrency(
        fixtureVariantWithPresentmentPrices,
        "BYN"
      )
    ).toBe(100);
  });

  it("if presentment currency is not found - gets undefined", async () => {
    expect(
      Helper.getVariantPriceForCurrency(
        fixtureVariantWithPresentmentPrices,
        "XYZ"
      )
    ).toBe(undefined);
  });
});
