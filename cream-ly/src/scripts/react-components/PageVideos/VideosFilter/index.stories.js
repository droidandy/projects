import React from "react";
import { newStore } from "@Core/redux";

import { action, actions } from "@storybook/addon-actions";

import { stateVideosData } from "../../VideosGroup/index.stories";

import VideosFilter from "./";

const storybookData = {
  title: "Pages/Videos/VideosFilter",
  component: VideosFilter,
  excludeStories: /.*Data$/,
};

export default storybookData;

const actionGroup = {
  // onChange: action("onChange"),
  // onComplete: action("onComplete"),
  onError: action("onError"),
  onClickButtonAddToCart: action("onClickButtonAddToCart"),
};

export const defaultState = (extraProps) => (
  <VideosFilter {...actionGroup} {...extraProps} />
);

export const stateIsClickedData = {
  isButtonResultsClicked: true,
};
export const errorState = (extraProps) => (
  <VideosFilter {...actionGroup} {...stateIsClickedData} {...extraProps} />
);

export const stateSelectedGoalsData = {
  goals: ["edema", "breast_shape"],
};
export const selectedState = (extraProps) => (
  <VideosFilter {...actionGroup} {...stateSelectedGoalsData} {...extraProps} />
);

export const stateResultData = {
  ...stateSelectedGoalsData,
  ...stateIsClickedData,
  ...stateVideosData,
};
export const resultsState = (extraProps) => (
  <VideosFilter {...actionGroup} {...stateResultData} {...extraProps} />
);

export const resultsStateIncludeBoughtVideos = (extraProps) => (
  <VideosFilter
    {...actionGroup}
    {...stateResultData}
    purchasedVideosHandles={["video-2-limfa", "video-5-guasha-massage"]}
    {...extraProps}
  />
);

export const resultsStateIncludeAllBoughtVideos = (extraProps) => (
  <VideosFilter
    {...actionGroup}
    {...stateResultData}
    goals={["edema"]}
    purchasedVideosHandles={[
      "video-2-limfa",
      "video-5-guasha-massage",
      "video-7-mewing",
      "video-8-taping"
    ]}
    {...extraProps}
  />
);

export const stateClickedData = {
  ...stateResultData,
  isButtonAddToCartClicked: true,
};
export const clickedState = (extraProps) => (
  <VideosFilter {...actionGroup} {...stateClickedData} {...extraProps} />
);
