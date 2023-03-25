import React from "react";
import CartEmpty from ".";

const lang = "ru";

export const getTitleData = (lang = "ru") => {
  return "Pages/CartCheckout/" + lang.toUpperCase() + "/Steps/1-CartEmpty";
};

export default {
  title: getTitleData(),
  component: CartEmpty,
  excludeStories: /.*Data$/,
};

export const emptyCart = (props) => <CartEmpty {...props} />;
