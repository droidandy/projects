import { assert } from "liquidjs";
import createCheckoutAndGetId from ".";
import fixtureResponseSuccess from "./fixture/responseSuccess.json";

//real created id Z2lkOi8vc2hvcGlmeS9DaGVja291dC82ZTZlNWRkZGQ5NDRiNjZhZDk4ZGFkZjAxMGJiMTliYz9rZXk9ZWRkYTA5NGUwZjMxYWEzYjVhNTFiN2JhMWE5ZmNlNmM=

describe("Shopify Storefront Checkout Create", () => {
  beforeEach(() => {
    fetchMock.doMock();
  });

  it("CheckoutCreate success", async () => {
    fetchMock.once(JSON.stringify(fixtureResponseSuccess));
    const checkoutId = await createCheckoutAndGetId();
    expect(checkoutId).toBe("fixtureId");
  });
});
