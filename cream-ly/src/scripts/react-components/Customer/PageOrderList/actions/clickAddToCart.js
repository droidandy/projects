import * as Router from "@Core/app/router";
import { types } from ".";
import * as ShopifyCartItems from "@Core/api/shopify.cart/items";

export default (variantId, properties) => {
  return (dispatch, getState) => {
    dispatch({ type: types.ACTION_CLICK_ADD_TO_CART, variantId });

    return ShopifyCartItems.add(variantId, properties)
      .then(() => dispatch({ type: types.ACTION_ADD_TO_CART_COMPLETE }))
      .then(Router.goToCart);
  };
};
