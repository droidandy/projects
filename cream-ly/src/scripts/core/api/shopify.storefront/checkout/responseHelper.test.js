//@ts-nocheck
import fixtureResponse from "./fixture/response";
import fixtureResponsePaidCheckout from "./fixture/response.isPaid";

import * as responseHelper from "./responseHelper";

describe("Shopify Storefront Checkout Reponse Convert", () => {
  it("is checkout paid", async () => {
    expect(responseHelper.isPaid(fixtureResponsePaidCheckout)).toBe(true);
    expect(responseHelper.isPaid(fixtureResponse)).toBe(false);
  });

  it("get checkout object", async () => {
    const result = responseHelper.response2Checkout(fixtureResponse);

    console.log(result);
  });
});
