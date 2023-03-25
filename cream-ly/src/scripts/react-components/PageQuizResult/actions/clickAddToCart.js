import * as Router from "@Core/app/router";
import { types } from "@Core/redux/quiz";
import * as ShopifyCartItems from "@Core/api/shopify.cart/items";
// Meet thunks.
// A thunk in this context is a function that can be dispatched to perform async
// activity and can dispatch actions and read state.
// This is an action creator that returns a thunk:
export default (items) => {
  // We can invert control here by returning a function - the "thunk".
  // When this function is passed to `dispatch`, the thunk middleware will intercept it,
  // and call it with `dispatch` and `getState` as arguments.
  // This gives the thunk function the ability to run some logic, and still interact with the store.

  return (dispatch, getState) => {
    dispatch({ type: types.ACTION_QUIZ_CLICK_ADD_TO_CART });

    return (
      ShopifyCartItems.addMultipleItems(items)
        // .then((res) => res.json())
        // .catch((ex) => dispatch(loadingFailure(ex)));
        .then((body) => dispatch(loadingSuccess(body)))
        .then(Router.goToCart)
    );
  };
};

function loadingSuccess(result) {
  return { type: types.ACTION_QUIZ_ADD_TO_CART_COMPLETE };
}
/*
function loadingFailure(error) {
  return { type: "error", error };
} */
