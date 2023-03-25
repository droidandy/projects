import React from "react";
import PageVideo from ".";
import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang.toUpperCase()),
  component: PageVideo,
  excludeStories: /.*Data$/,
};

export const defaultPage = (extraData) => {
  return stories.defaultPage({ ...extraData, lang });
};

export const WithRecommendedVideos = (extraData) => {
  return stories.WithRecommendedVideos({ ...extraData, lang });
};
export const CustomerPurchasedVideo = (extraData) => {
  return stories.CustomerPurchasedVideo({ ...extraData, lang });
};

export const noFeedback = (extraData) => {
  return stories.noFeedback({ ...extraData, lang });
};

export const discountedProductPage = (extraData) => {
  return stories.discountedProductPage({ ...extraData, lang });
};
