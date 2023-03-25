import React from "react";

import { action, actions } from "@storybook/addon-actions";

import PageVideo from ".";

import { stateVideosData } from "../VideoList/index.stories";
import orderExample from "./order.json";

const defaultOrder = orderExample.order;
const lang = "ru";

export const getTitleData = (lang) => {
  return `Pages/ProductVideoDetails/${lang}`;
};

export default {
  title: getTitleData(lang.toUpperCase()),
  component: PageVideo,
  excludeStories: /.*Data$/,
};

const actionGroup = {
  onClick: action("onClick"),
};

export const stateDefaultData = {
  ...stateVideosData,
  handle: stateVideosData.videos[1].handle,
};

export const defaultPage = (extraProps) => (
  <PageVideo {...actionGroup} {...stateDefaultData} {...extraProps} />
);
export const video1 = (extraProps) => (
  <PageVideo
    {...actionGroup}
    {...stateDefaultData}
    handle={stateVideosData.videos[1].handle}
    {...extraProps}
  />
);
export const video2Limfa = (extraProps) => (
  <PageVideo
    {...actionGroup}
    {...stateDefaultData}
    handle={stateVideosData.videos[2].handle}
    {...extraProps}
  />
);
export const video3Osanka = (extraProps) => (
  <PageVideo
    {...actionGroup}
    {...stateDefaultData}
    handle={stateVideosData.videos[3].handle}
    {...extraProps}
  />
);
export const video4BuccalMassage = (extraProps) => (
  <PageVideo
    {...actionGroup}
    {...stateDefaultData}
    handle={stateVideosData.videos[4].handle}
    {...extraProps}
  />
);
export const video5GuashaMassage = (extraProps) => (
  <PageVideo
    {...actionGroup}
    {...stateDefaultData}
    handle={stateVideosData.videos[5].handle}
    {...extraProps}
  />
);
export const video6Cellulite = (extraProps) => (
  <PageVideo
    {...actionGroup}
    {...stateDefaultData}
    handle={stateVideosData.videos[6].handle}
    {...extraProps}
  />
);
export const video7Mewing = (extraProps) => (
  <PageVideo
    {...actionGroup}
    {...stateDefaultData}
    handle={stateVideosData.videos[7].handle}
    {...extraProps}
  />
);
export const video8Taping = (extraProps) => (
  <PageVideo
    {...actionGroup}
    {...stateDefaultData}
    handle={stateVideosData.videos[8].handle}
    {...extraProps}
  />
);

export const video9BodyTaping = (extraProps) => (
  <PageVideo
    {...actionGroup}
    {...stateDefaultData}
    handle={stateVideosData.videos[9].handle}
    {...extraProps}
  />
);

export const videoAging = (extraProps) => (
  <PageVideo
    {...actionGroup}
    {...stateDefaultData}
    handle={stateVideosData.videos[0].handle}
    {...extraProps}
  />
);

export const recommendedVideosData = {
  ...stateDefaultData,
  recommendedVideosHandles: ["video-1", "video-2-limfa", "video-3-osanka"],
};
export const WithRecommendedVideos = (extraProps, props) => {
  return (
    <PageVideo {...actionGroup} {...recommendedVideosData} {...extraProps} />
  );
};

export const purchasedVideosData = {
  handle: stateVideosData.videos[1].handle,
  purchasedVideosHandles: [stateVideosData.videos[1].handle],
};

export const CustomerPurchasedVideo = (extraProps, props) => {
  return (
    <PageVideo {...actionGroup} {...extraProps} {...purchasedVideosData} />
  );
};

export const stateNoFeedbackData = {
  ...stateDefaultData,
  video: {
    ...stateDefaultData.video,
    feedbacks: [],
  },
};

export const noFeedback = (extraProps) => (
  <PageVideo {...actionGroup} {...stateNoFeedbackData} {...extraProps} />
);

export const discountedProductData = {
  ...stateDefaultData,
  video: {
    ...stateDefaultData.video,
    discountUntil: {
      date: Date("2020-08-02"),
      text: "до 2 августа цена",
      comparePrice: 23,
    },
  },
};

export const discountedProductPage = (extraProps) => (
  <PageVideo {...actionGroup} {...discountedProductData} {...extraProps} />
);
