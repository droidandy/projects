import React from "react";
import ProductQuiz from ".";
import * as stories from "./index.stories";

const lang = "en";

export default {
  title: stories.getTitleData(lang.toUpperCase()),
  component: ProductQuiz,
  excludeStories: /.*Data$/,
};

export const empty = (extraData) => {
  return stories.empty({ ...extraData, lang });
};

export const WithGoals = (extraData) => {
  return stories.WithGoals({ ...extraData, lang });
};

export const AddToCartError = (extraData) => {
  return stories.AddToCartError({ ...extraData, lang });
};
