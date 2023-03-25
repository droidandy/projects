import { getCountryCode as getCountryCodeFromStorage } from "@Core/app/user/storage";
import CustomerStateShape from "./shape.ts";
import getCustomerVideos from "./videos";
import filterDigitalOnlyAddress from "./addresses";

/**
 * @typedef CustomerStateShape
 */
const initialState = {
  id: undefined,
  firstName: undefined,
  lastName: undefined,
  phone: undefined,
  email: undefined,
  tags: [],
  addresses: [],
  defaultCountryCode: "NL",
  defaultAddressId: undefined,
  orders: [],
  lastOrderId: undefined,
  videos: [],
};

const ACTION_SET_CUSTOMER = "ACTION_SET_CUSTOMER";
const ACTION_ADD_NEW_ADDRESS = "ACTION_ADD_NEW_ADDRESS";

export const types = {
  ACTION_SET_CUSTOMER,
  ACTION_ADD_NEW_ADDRESS,
};

/**
 * @param {CustomerStateShape} state
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case types.ACTION_SET_CUSTOMER:
      return {
        ...state,
        ...action.customer,
        addresses: filterDigitalOnlyAddress(action.customer.addresses),
        videos: getCustomerVideos(action.customer),
      };
    case types.ACTION_ADD_NEW_ADDRESS:
      return {
        ...state,
        addresses: [...state.address, action.address],
      };

    default:
      return state;
  }
};
