import React from "react";

import { action, actions } from "@storybook/addon-actions";

import PageVideos from "./index";

import { stateVideosData } from "../VideoList/index.stories";

export const getTitleData = (lang) => {
  return `/Pages/Videos/${lang.toUpperCase()}`;
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: PageVideos,
  excludeStories: /.*Data$/,
};

const actionGroup = {
  onChange: action("onChange"),
  onComplete: action("onComplete"),
  onError: action("onError"),
  onClickButtonAddToCart: action("onClickButtonAddToCart"),
};

export const defaultPage = (extraProps) => (
  <PageVideos {...actionGroup} {...stateVideosData} {...extraProps} />
);
