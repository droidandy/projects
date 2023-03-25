const initialState: IReduxCheckoutShape = {
  isLoaded: false,
  items: [],
  itemsCount: 0,
  note: "",
  storefrontCheckoutId: null,
  checkoutId: null,
};

const ACTION_SET_CHECKOUT_CART_AND_ID = "ACTION_SET_CHECKOUT_CART_AND_ID";
const ACTION_SET_CHECKOUT_DATA = "ACTION_SET_CHECKOUT_DATA";

export const types = {
  ACTION_SET_CHECKOUT_CART_AND_ID,
  ACTION_SET_CHECKOUT_DATA,
};

interface ICheckoutAction {
  type: "ACTION_SET_CHECKOUT_CART_AND_ID" | "ACTION_SET_CHECKOUT_DATA";
  note?: string;
  items: ICartItem[];
}

export default (state: IReduxCheckoutShape = initialState, action) => {
  switch (action.type) {
    /* case types.ACTION_SET_CHECKOUT_CART_AND_ID:
      return {
        ...state,
        storefrontCheckoutId: action.storefrontCheckoutId,
        checkoutId: action.checkoutId,
      }; */

    case types.ACTION_SET_CHECKOUT_DATA:
      const newState = { ...state };
      newState.isLoaded = true;
      if (Array.isArray(action.items)) {
        const itemsCount = action.items.reduce(
          (acc, val) => acc + val.quantity,
          0
        );

        newState.items = action.items;
        newState.itemsCount = itemsCount;
      }
      if (action.note !== undefined) newState.note = action.note;

      if (action.storefrontCheckoutId !== undefined)
        newState.storefrontCheckoutId = action.storefrontCheckoutId;
      if (action.checkoutId !== undefined)
        newState.checkoutId = action.checkoutId;

      return newState;

    default:
      return state;
  }
};
