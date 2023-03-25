import { types } from "@Core/redux/customer";

export default (customer) => {
  return {
    type: types.ACTION_SET_CUSTOMER,
    customer,
  };
};
