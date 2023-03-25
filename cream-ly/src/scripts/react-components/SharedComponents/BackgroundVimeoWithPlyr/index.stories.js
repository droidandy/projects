import React from "react";

import { action, actions } from "@storybook/addon-actions";

import Video from ".";

const storybookData = {
  title: "Sections/BackgroundVimeoWithPlyr",
  component: Video,
};

export default storybookData;

const props = {
  vimeoId: "428082124",
};

export const defaultState = (extraProps) => (
  <Video {...props} {...extraProps} />
);
