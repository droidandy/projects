import React from "react";

import CustomerPageVideo from ".";
import { action } from "@storybook/addon-actions";

export const getTitleData = (lang) => {
  return `/Pages/Customer/PageVideo/${lang.toUpperCase()}`;
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: CustomerPageVideo,
  excludeStories: /.*Data$/,
};

const defaultData = {
  lang,
  customer: {
    id: "123456789",
    name: "Ivanna Ivanova",
    email: "email@cream.ly",
    videos: [
      "video-aging",
      "video-1",
      "video-2-limfa",
      "video-3-osanka",
      "video-4-buccal-massage",
      "video-5-guasha-massage",
      "video-6-cellulite",
      "video-7-mewing",
      "video-8-taping",
      "video-9-body-taping",
    ],
  },

  actionOnVideoSelect: (videoHandle) => {
    action("onClick")("actionOnVideoSelect");
  },
  actionOnBuy: (videoHandle) => {
    action("onClick")("actionOnBuy");
  },
  actionOnVideoPartSelect: (videoHandle, videoPart) => {
    action("onClick")("actionOnVideoPartSelect", videoHandle, videoPart);
  },
};

export const hasAccessVideo1 = (extraProps) => {
  return <CustomerPageVideo {...defaultData} {...extraProps} />;
};

export const hasAccessVideo2Part2Selected = (extraProps) => {
  return (
    <CustomerPageVideo
      {...defaultData}
      selectedVideoHandle={"video-1"}
      selectedVideoPartNumber={1}
      {...extraProps}
    />
  );
};

export const noAccess = (extraProps) => {
  return (
    <CustomerPageVideo
      {...defaultData}
      customer={{
        ...defaultData.customer,
        videos: [],
      }}
      selectedVideoHandle={"video-2-limfa"}
      {...extraProps}
    />
  );
};

export const notLogin = (extraProps) => {
  return <CustomerPageVideo {...defaultData} customer={{}} {...extraProps} />;
};
