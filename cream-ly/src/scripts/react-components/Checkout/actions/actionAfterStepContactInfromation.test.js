import * as action from "./actionAfterStepContactInfromation";
import * as ShopifyStorefront from "@Core/api/shopify.storefront/checkout";
import * as ShopifyStorefrontAttributes from "@Core/api/shopify.storefront/checkout/attributes";

jest.mock("@Core/api/shopify.storefront/checkout");
jest.mock("@Core/api/shopify.storefront/checkout/attributes");

describe("actionStepContactInfromation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip("default - checkout id", async () => {
    const checkout = {
      storefrontCheckoutId: 123,
      email: "some@gmail.com",
      shippingAddress: {
        firsName: "somename",
      },
    };

    const result = await action.default(checkout);

    expect(ShopifyStorefront.updateEmail).toHaveBeenCalledWith(
      checkout.storefrontCheckoutId,
      checkout.email
    );
    /* expect(ShopifyStorefront.updateAddress).toHaveBeenCalledWith(
      checkout.storefrontCheckoutId,
      checkout.shippingAddress
    ); */
  });
});
