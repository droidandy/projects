import { getCart } from "@Core/api/shopify.cart";
import cartItemConverter from "@Core/checkout/helpers/cartItemConverter";
import store from "@Core/redux";
import * as Currency from "@Core/currency";

const loadDataForRedux = async () => {
  const state = store.getState();
  const currencyRateExchange =
    state.theme.currency.isoCode == "BYN"
      ? state.theme.currency.exchangeBYN
      : 1;

  const cart = await getCart();
  const items = cart.items.map(cartItemConverter).map((item) => ({
    ...item,
    price: Currency.convertPrice(item.price * 100, currencyRateExchange) / 100,
  }));

  const storefrontCheckoutId = cart.attributes.storefrontCheckoutId;
  const checkoutId = cart.attributes.checkoutId;

  store.dispatch({
    type: "ACTION_SET_CHECKOUT_DATA",
    items,
    note: cart.note && cart.note != "null" ? cart.note : null,
    storefrontCheckoutId,
    checkoutId,
  });
  /* case types.ACTION_SET_CHECKOUT_CART_AND_ID:
      return {
        ...state,
        storefrontCheckoutId: action.storefrontCheckoutId,
        checkoutId: action.checkoutId,
      }; */
};
export default loadDataForRedux;
