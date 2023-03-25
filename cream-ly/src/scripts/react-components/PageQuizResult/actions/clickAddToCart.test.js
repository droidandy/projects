import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import clickAddToCart from "./clickAddToCart";
import { types } from "@Core/redux/quiz";
import * as ShopifyCartItems from "@Core/api/shopify.cart/items";
jest.mock("@Core/api/shopify.cart/items");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("action clickAddToCart", () => {
  afterEach(() => {
    // fetchMock.restore();
  });

  it.skip("filters selectedProducts currectly", async () => {
    ShopifyCartItems.updateMultipleItems = jest.fn().mockResolvedValue(null);

    const products = [
      { handle: "handle1", variantId: "var1" },
      { handle: "handle2", variantId: "var2" },
      { handle: "handle3", variantId: "var3" },
    ];
    const store = mockStore({
      quizResults: {
        selectedProducts: ["handle2"],
      },
    });

    await store.dispatch(clickAddToCart(products)).then(() => {
      expect(ShopifyCartItems.updateMultipleItems.mock.calls).toEqual([
        [
          {
            var2: 1,
          },
        ],
      ]);
    });
  });

  it.skip("creates FETCH_TODOS_SUCCESS when fetching todos has been done", async () => {
    ShopifyCartItems.updateMultipleItems = jest.fn().mockResolvedValue(null);

    const store = mockStore({
      videosFilter: {
        videos: [
          {
            variantId: "31756780830774",
          },
          {
            variantId: "32041978429494",
          },
        ],
      },
    });

    await store.dispatch(clickAddToCart()).then(() => {
      // return of async actions

      expect(ShopifyCartItems.updateMultipleItems.mock.calls).toEqual([
        [
          {
            "31756780830774": 1,
            "32041978429494": 1,
          },
        ],
      ]);

      expect(store.getActions()).toEqual([
        { type: types.ACTION_QUIZ_CLICK_ADD_TO_CART },
        {
          type: types.ACTION_QUIZ_ADD_TO_CART_COMPLETE,
        },
      ]);
    });
  });
});
