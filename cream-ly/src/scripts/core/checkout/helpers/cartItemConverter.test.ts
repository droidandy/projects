import * as Converter from "./cartItemConverter";
import fixtureCart from "@Core/api/shopify.cart/_fixtures/response.cart";

describe("checkout.deliveryCalculator", () => {
  it("workds", async () => {
    const items = fixtureCart.items;
    const result = items.map(Converter.default);
    // console.log(JSON.stringify(result, null, 2));
  });
});
