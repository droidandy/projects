import { config, action } from "@storybook/addon-actions";
import React from "react";
import SiteHeader from ".";
import { setDefaultPropsData } from "../Localization/PreferencesModal/sections/Form/index.stories";
export const getTitleData = (lang) => {
  return "Sections/SiteHeader/" + lang.toUpperCase() + "";
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: SiteHeader,
  excludeStories: /.*Data$/,
};

const defaultStateData = {
  isCurrencyHidden: false,
  currencyCode: "EUR",
  regionSettings: setDefaultPropsData("EU", "EUR"),
  cartCount: 0,
};

export const defaultState = (extraProps) => (
  <SiteHeader {...defaultStateData} {...extraProps} />
);


//this is used for static HTML generator
export const animationOff = (extraProps) => (
  <SiteHeader {...defaultStateData} isAnimationOff={true} s{...extraProps} />
);



export const mobileMenuOpen = (extraProps) => (
  <SiteHeader {...defaultStateData} isMobileMenuOpen={true} {...extraProps} />
);


export const quizNotification = (extraProps) => (
  <SiteHeader {...defaultStateData} isQuizReady={true} {...extraProps} />
);

const cartNotEmptyData = {
  ...defaultStateData,
  cartCount: 2,
};

export const cartNotEmpty = (extraProps) => (
  <SiteHeader {...cartNotEmptyData} {...extraProps} />
);

export const userLogIn = (extraProps) => (
  <SiteHeader isCustomerLoggedIn={true} {...extraProps} />
);

const hostBYData = {
  ...defaultStateData,
  host: "creamly.by",
};

export const hostCREAMLY_BY = (extraProps) => (
  <SiteHeader {...hostBYData} {...extraProps} />
);

const hostRUData = {
  ...defaultStateData,
  host: "creamly.ru",
};
export const hostCREAMLY_RU = (extraProps) => (
  <SiteHeader {...hostRUData} {...extraProps} />
);

const hostEUData = {
  ...defaultStateData,
  host: "cream.ly",
};
export const hostCREAMLY_EU = (extraProps) => (
  <SiteHeader {...hostEUData} {...extraProps} />
);
