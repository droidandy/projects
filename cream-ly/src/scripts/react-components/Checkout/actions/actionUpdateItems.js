import * as ShopifyCartItems from "@Core/api/shopify.cart/items";
import * as ShopifyCart from "@Core/api/shopify.cart";
import store from "@Core/redux";

// we don't use bulkUpdate here as someItems could have custom properties and we want to preserve it
export default async function(items) {
  return ShopifyCart.getCart().then((cart) => {
    store.dispatch({
      type: "ACTION_SET_CHECKOUT_DATA",
      items,
    });

    return cart.items.map((cartItem, index) => {
      let quantity = 0;

      const matchingItem = items.filter((item) => cartItem.key === item.key);
      if (matchingItem && matchingItem.length)
        quantity = matchingItem[0].quantity;

      if (cartItem.quantity !== quantity)
        ShopifyCartItems.changeItemQuanity(index + 1, quantity);
    });
  });
}
