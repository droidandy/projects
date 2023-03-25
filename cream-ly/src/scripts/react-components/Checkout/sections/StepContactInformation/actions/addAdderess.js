import { types } from "@Core/redux/customer";

export default (address) => {
  return {
    type: types.ACTION_ADD_NEW_ADDRESS,
    address,
  };
};
