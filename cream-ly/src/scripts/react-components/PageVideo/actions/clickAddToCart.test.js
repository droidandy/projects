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

  it("creates FETCH_TODOS_SUCCESS when fetching todos has been done", async () => {
    ShopifyCartItems.updateMultipleItems = jest.fn().mockResolvedValue(null);

    const store = mockStore({});

    const variantId = "31756780830774";
    await store.dispatch(clickAddToCart(variantId)).then(() => {
      // return of async actions

      expect(ShopifyCartItems.updateMultipleItems.mock.calls).toEqual([
        [
          {
            "31756780830774": 1,
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
