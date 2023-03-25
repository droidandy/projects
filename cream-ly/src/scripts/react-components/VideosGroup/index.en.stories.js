import React from "react";
import * as stories from "./index.stories";

import { action, actions } from "@storybook/addon-actions";

import VideosGroup from "./index";

import {stateVideosData} from "../VideoList/index.stories";

export default {
  title: "Sections/VideosGroup",
  component: VideosGroup,
  excludeStories: /.*Data$/
};
const actionGroup = {
  onClickButtonAddToCart: action("onClickButtonAddToCart")
};

export const defaultPage = stories.defaultPage({lang: "en"});
