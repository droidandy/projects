import * as action from "./actionAfterStepCartFilled";
import * as ShopifyCart from "@Core/api/shopify.cart";
import * as ShopifyCartItems from "@Core/api/shopify.cart/items";
import * as ShopifyCartAttributes from "@Core/api/shopify.cart/attributes";
import * as ShopifyStorefront from "@Core/api/shopify.storefront/checkout";
import * as CreamlyBackend from "@Core/api/creamly.firebase";

jest.mock("@Core/api/shopify.cart");
jest.mock("@Core/api/shopify.cart/items");
jest.mock("@Core/api/shopify.cart/attributes");
jest.mock("@Core/api/creamly.firebase");
jest.mock("@Core/api/shopify.storefront/checkout");

describe.skip("actionStepCartFilled", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("default - no checkout id - create checkout", async () => {
    const checkout = {
      storefrontCheckoutId: null,
      note: "some test note",
      items: [
        { variantId: 123, quantity: 1 },
        { variantId: 234, quantity: 2 },
      ],
      attributes: { testAttribute: "works" },
    };

    CreamlyBackend.checkoutCreate = async () => {
      return {
        checkoutId: 14544467329078,
        storefrontId:
          "Z2lkOi8vc2hvcGlmeS9DaGVja291dC80YmQyZGEyMTU5ODk1YzUwNzQ4Mjk3YzIzOWNiYWQwNj9rZXk9OTE5Y2RkZDY4OTE1NDhkZTVlZjFjZjA1NzI3YzBlZmQ=",
      };
    };

    ShopifyCart.getToken = async () => {
      return "someToken";
    };

    const result = await action.default(checkout);
    expect(result.storefrontCheckoutId).toBe(
      "Z2lkOi8vc2hvcGlmeS9DaGVja291dC80YmQyZGEyMTU5ODk1YzUwNzQ4Mjk3YzIzOWNiYWQwNj9rZXk9OTE5Y2RkZDY4OTE1NDhkZTVlZjFjZjA1NzI3YzBlZmQ="
    );
    expect(result.checkoutId).toBe(14544467329078);
  });

  it("default - with checkout id - fetch checkout", async () => {
    const checkout = {
      storefrontCheckoutId: 123,
      note: null,
      items: [],
      attributes: null,
    };

    ShopifyStorefront.fetch = jest.fn(async () => {
      return { id: 123, shippingAddress: { firstName: "1" } };
    });

    const result = await action.default(checkout);
    expect(result).toStrictEqual({
      storefrontCheckoutId: 123,
      email: null,
      shippingAddress: {
        firstName: "1",
      },
    });
    expect(ShopifyStorefront.fetch).toHaveBeenCalledWith(123);
  });

  it("transform items to ShopifyCartItems:updateMultipleItems format", async () => {
    const data = {
      items: [
        { variantId: 123, quantity: 1 },
        { variantId: 234, quantity: 2 },
      ],
    };
    const transformedItems = action.mapItems2ShopifyCartUpdate(data.items);
    expect(transformedItems).toStrictEqual({ "123": 1, "234": 2 });
  });

  it("action.saveShopifyCart", async () => {
    const checkout = {
      note: "some test note 2",
      items: [
        { variantId: 1232, quantity: 1 },
        { variantId: 2342, quantity: 22 },
      ],
      attributes: { checkoutId: 1235, testAttribute: "works" },
    };

    const result = await action.saveShopifyCart(checkout);

    expect(ShopifyCartItems.updateMultipleItems).toHaveBeenCalledWith({
      "1232": 1,
      "2342": 22,
    });

    expect(ShopifyCartAttributes.setAttributesAndNote).toHaveBeenCalledWith(
      {
        checkoutId: 1235,
        testAttribute: "works",
      },
      "some test note 2"
    );
  });

  it("action.saveStorefront", async () => {
    const checkout = {
      storefrontCheckoutId: 1,
      note: "some test note 3",
      items: [
        { variantId: 1232, quantity: 1 },
        { variantId: 2342, quantity: 22 },
      ],
      attributes: { checkoutId: 1235, testAttribute: "works" },
    };

    const result = await action.saveStorefront(checkout);

    expect(ShopifyStorefront.updateNote).toHaveBeenCalledWith(
      checkout.storefrontCheckoutId,
      checkout.note
    );
    expect(ShopifyStorefront.updateAttributes).toHaveBeenCalledWith(
      checkout.storefrontCheckoutId,
      checkout.attributes
    );
    expect(ShopifyStorefront.updateItems).toHaveBeenCalledWith(
      checkout.storefrontCheckoutId,
      checkout.items
    );
  });
});
