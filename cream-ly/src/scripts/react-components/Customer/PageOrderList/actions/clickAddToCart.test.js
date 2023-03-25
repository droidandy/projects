import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { clickAddToCart, types } from "./";
import * as ShopifyCartItems from "@Core/api/shopify.cart/items";
jest.mock("@Core/api/shopify.cart/items");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("action clickAddToCart", () => {
  afterEach(() => {
    // fetchMock.restore();
  });

  it("Add variant to cart", async () => {
    ShopifyCartItems.add = jest.fn().mockResolvedValue(null);

    const store = mockStore({});

    const variantId = "12345";

    await store.dispatch(clickAddToCart(variantId, {})).then(() => {
      // return of async actions

      expect(ShopifyCartItems.add.mock.calls).toEqual([
        ["12345", {}],
      ]);

      expect(store.getActions()).toEqual([
        { type: types.ACTION_CLICK_ADD_TO_CART, variantId: "12345" },
        {
          type: types.ACTION_ADD_TO_CART_COMPLETE,
        },
      ]);
    });
  });
});
