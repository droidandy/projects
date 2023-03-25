import React from "react";
import Icon from ".";

const lang = "ru";

export const getTitleData = (lang = "ru") => {
  return (
    "Pages/CartCheckout/" +
    lang.toUpperCase() +
    "/Steps/1-CartFilled/CartItem/IconDelete"
  );
};

export default {
  title: getTitleData(),
  component: Icon,
  excludeStories: /.*Data$/,
};

export const defaultState = (props) => (
  <React.Fragment>
    <Icon {...props} />
    <Icon {...props} isActive />;
  </React.Fragment>
);
