import React from "react";
import PageOrderList from ".";
import * as stories from "./index.stories";

const lang = "en";

export default {
  title: "Pages/Customer/OrdersList/" + lang.toUpperCase(),
  component: PageOrderList,
  excludeStories: /.*Data$/,
};

export const noOrders = (extraProps) => {
  return stories.noOrders({ ...extraProps, lang });
};

export const videoOrders = (extraProps) => {
  return stories.videoOrders({ ...extraProps, lang });
};

export const canceledOrders = (extraProps) => {
  return stories.canceledOrders({ ...extraProps, lang });
};

export const acceptedOrders = (extraProps) => {
  return stories.acceptedOrders({ ...extraProps, lang });
};

export const withNoteOrders = (extraProps) => {
  return stories.withNoteOrders({ ...extraProps, lang });
};

export const withVideos = (extraProps) => {
  return stories.withVideos({ ...extraProps, lang });
};
