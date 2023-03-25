jest.mock("shopify-buy");

import * as ShopifyCartAttributes from ".";

describe("api shopify.cart", () => {
  it("attributesToFormData", async () => {
    const attributes = {
      nullKey: null,
      textKey: "text",
      numberKey: 22,
      arrayKey: ["one item", "second item"],
    };

    const result = ShopifyCartAttributes.attributesToFormData(attributes);
  });
});
