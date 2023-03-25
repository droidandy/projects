import { config, action } from "@storybook/addon-actions";
import React from "react";
import MobileMenuAnimation from ".";
export const getTitleData = (lang) => {
  return "Sections/SiteHeader/MobileMenu/Animation";
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: MobileMenuAnimation,
  excludeStories: /.*Data$/,
};

const defaultStateData = {
  
};

export const defaultState = (extraProps) => (
  <MobileMenuAnimation {...defaultStateData} {...extraProps} />
);

export const animationDone = (extraProps) => (
  <MobileMenuAnimation {...defaultStateData} isAnimationDone={true} {...extraProps} />
);
