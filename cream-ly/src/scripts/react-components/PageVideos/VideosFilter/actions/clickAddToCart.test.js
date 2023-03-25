import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { clickAddToCart, types } from ".";
import * as ShopifyCartItems from "@Core/api/shopify.cart/items";
jest.mock("@Core/api/shopify.cart/items");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("action clickAddToCart", () => {
  afterEach(() => {
    // fetchMock.restore();
  });

  it.skip("add videos to cart", async () => {
    ShopifyCartItems.updateMultipleItems = jest.fn().mockResolvedValue(null);

    const store = mockStore({
      products: {
        videos: [
          {
            handle: "handle1",
            variantId: "123",
          },
          {
            handle: "handle2",
            variantId: "12345",
          },
        ],
      },
      videosFilter: {
        selectedVideosHandles: ["handle1", "handle2"],
      },
    });

    await store.dispatch(clickAddToCart()).then(() => {
      // return of async actions

      expect(ShopifyCartItems.updateMultipleItems.mock.calls).toEqual([
        [
          {
            "123": 1,
            "12345": 1,
          },
        ],
      ]);

      expect(store.getActions()).toEqual([
        { type: types.ACTION_CLICK_ADD_TO_CART },
        {
          type: types.ACTION_ADD_TO_CART_COMPLETE,
        },
      ]);
    });
  });
});
