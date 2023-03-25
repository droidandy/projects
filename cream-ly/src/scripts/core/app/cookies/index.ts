import store from "@Core/redux";
import { types } from "@Core/redux/app";

export const acceptCookies = () => {
  localStorage.setItem("isAcceptCookies", "true");
  store.dispatch({
    type: types.ACTION_SET_COOKIES,
    payload: { isAccepted: true }
  });
};

export const checkIfRequired = (region: string): boolean => {
  // if (region === "BY") {
  //   return false;
  // }
  return true;
};

export const checkIfCookiesAccepted = () => {
  try {
    const isAcceptCookies = localStorage.getItem("isAcceptCookies");
    return JSON.parse(isAcceptCookies) || false;
  } catch (err) {
    return false;
  }
};
