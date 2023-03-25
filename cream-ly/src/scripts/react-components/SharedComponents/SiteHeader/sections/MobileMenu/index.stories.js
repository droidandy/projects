import { config, action } from "@storybook/addon-actions";
import React from "react";
import MobileMenu from ".";
export const getTitleData = (lang) => {
  return "Sections/SiteHeader/MobileMenu/" + lang.toUpperCase() + "";
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: MobileMenu,
  excludeStories: /.*Data$/,
};

const defaultStateData = {
  
};

export const defaultState = (extraProps) => (
  <MobileMenu {...defaultStateData} {...extraProps} />
);

