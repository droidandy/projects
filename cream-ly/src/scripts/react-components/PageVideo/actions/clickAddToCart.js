import * as Router from "@Core/app/router";
import { types } from ".";
import * as ShopifyCartItems from "@Core/api/shopify.cart/items";
// Meet thunks.
// A thunk in this context is a function that can be dispatched to perform async
// activity and can dispatch actions and read state.
// This is an action creator that returns a thunk:
export default (variantId) => {
  // We can invert control here by returning a function - the "thunk".
  // When this function is passed to `dispatch`, the thunk middleware will intercept it,
  // and call it with `dispatch` and `getState` as arguments.
  // This gives the thunk function the ability to run some logic, and still interact with the store.
  return (dispatch, getState) => {
    dispatch({ type: types.ACTION_CLICK_ADD_TO_CART });

    if (!variantId) return;

    let updates = {};
    updates[variantId] = 1;

    return ShopifyCartItems.updateMultipleItems(updates)
      .then(() => dispatch({ type: types.ACTION_ADD_TO_CART_COMPLETE }))
      .then(Router.goToCart);
  };
};
