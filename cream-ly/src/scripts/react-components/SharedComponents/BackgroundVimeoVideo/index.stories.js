import React from "react";

import { action, actions } from "@storybook/addon-actions";

import Video from ".";

const storybookData = {
  title: "Sections/BackgroundVimeoVideo",
  component: Video,
};

export default storybookData;

const props = {
  vimeoId: "428082124",
};

export const defaultState = (extraProps) => (
  <Video {...props} {...extraProps} />
);

export const isActive = (extraProps) => (
  <Video isActive {...props} {...extraProps} />
);
/* 
export const autoPlay = (extraProps) => (
  <Video
    isAutoPlay={true}
    isMuted={true}
    isControlsOn={false}
    {...props}
    {...extraProps}
  />
);

export const background = (extraProps) => (
  <Video isAutoPlay isBackground {...props} {...extraProps} />
);
 */
