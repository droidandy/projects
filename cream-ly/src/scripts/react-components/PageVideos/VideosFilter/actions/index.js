export const ACTION_CHANGE_GOALS = "ACTION_CHANGE_GOALS";
export const ACTION_CLICK_SHOW_RESULT = "ACTION_CLICK_SHOW_RESULT";
export const ACTION_CLICK_ADD_TO_CART = "ACTION_CLICK_ADD_TO_CART";
export const ACTION_ADD_TO_CART_COMPLETE = "ACTION_ADD_TO_CART_COMPLETE";
export const ACTION_ADD_TO_CART_ERROR = "ACTION_ADD_TO_CART_ERROR";
export const ACTION_SELECT_VIDEO_HANDLE = "ACTION_SELECT_VIDEO_HANDLE";

export const types = {
  ACTION_CHANGE_GOALS,
  ACTION_CLICK_SHOW_RESULT,
  ACTION_CLICK_ADD_TO_CART,
  ACTION_ADD_TO_CART_COMPLETE,
  ACTION_ADD_TO_CART_ERROR,
  ACTION_SELECT_VIDEO_HANDLE,
};

export const clickAddToCart = require("./clickAddToCart").default;
export const selectVideoHandle = require("./selectVideoHandle").default;
export const changeGoals = require("./changeGoals").default;
