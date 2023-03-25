import React from "react";

import { action, actions } from "@storybook/addon-actions";

import ProductQuiz from "./index";
const lang = "ru";
export const getTitleData = (lang) => {
  return `Sections/ProductQuiz/${lang.toUpperCase()}`;
};
export default {
  title: getTitleData(lang),
  component: ProductQuiz,
  excludeStories: /.*Data$/,
};

const props = {
  skinType: "dry",
  goals: ["wrinkles", "pimple"],
};

const actionsData = {
  onComplete: action("onComplete"),
  onError: action("onError"),
};

export const empty = (extraData) => (
  <ProductQuiz {...actionsData} {...extraData} handle="cream-my-skin" />
);

export const WithGoals = (extraData) => (
  <ProductQuiz
    handle="flower-powder-my-skin"
    {...props}
    {...extraData}
    {...actionsData}
  />
);
export const AddToCartError = (extraData) => (
  <ProductQuiz handle="flower-powder-my-skin" {...actionsData} {...extraData} />
);
