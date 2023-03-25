import React from "react";
import * as stories from "./index.stories";
import VideoList from "./index";

export default {
  title: "Sections/VideoList/EN",
  component: VideoList,
  excludeStories: /.*Data$/,
};

export const defaultVideo = stories.defaultVideo({ lang: "en" });
