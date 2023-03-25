import React from "react";
import { action } from "@storybook/addon-actions";

import CookiesAcceptModal from ".";

export const getTitleData = (lang) => {
  return "Sections/CookiesAcceptModal/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: CookiesAcceptModal,
  excludeStories: /.*Data$/,
};

export const Popup = (extraProps) => (
  <CookiesAcceptModal
    isShow
    lang={lang}
    acceptCookiesHandle={action("acceptCookies")}
    {...extraProps}
  />
);
