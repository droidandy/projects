import React from "react";
import CartNote, { TypeProps } from ".";

import { action } from "@storybook/addon-actions";

const lang = "ru";

export const getTitleData = (lang = "ru") => {
  return (
    "Pages/CartCheckout/" + lang.toUpperCase() + "/Steps/1-CartFilled/CartNote"
  );
};

export default {
  title: getTitleData(),
  component: CartNote,
  excludeStories: /.*Data$/,
};

const emptyData: TypeProps = {
  onNoteUpdate: action("onNoteUpdate"),
  lang,
};
export const emptyNote = (props) => <CartNote {...emptyData} {...props} />;

const filledData: TypeProps = {
  ...emptyData,
  customerNote: "here goes customer note which is displayed here",
};
export const filledNote = (props) => <CartNote {...filledData} {...props} />;
