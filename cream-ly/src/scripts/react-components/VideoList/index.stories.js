import React from "react";

import { action } from "@storybook/addon-actions";

import VideoList from "./index";

import { getVideosList } from "@Core/products/video";
export const stateVideosData = { videos: getVideosList() };

export default {
  title: "Sections/VideoList",
  component: VideoList,
  excludeStories: /.*Data$/,
};

const actionGroup = {
  onClick: action("onClick"),
};

const defaultVideoData = {
  ...stateVideosData,
  ...actionGroup,
};

export const defaultVideo = (extraProps) => (
  <VideoList {...defaultVideoData} {...extraProps} />
);

const purchasedVideoData = {
  ...defaultVideoData,
  isVisiblePurchasedBadge: true,
  purchasedVideosHandles: ["video-1", "video-2-limfa"],
};

export const purchasedVideo = (extraProps) => (
  <VideoList {...purchasedVideoData} />
);
