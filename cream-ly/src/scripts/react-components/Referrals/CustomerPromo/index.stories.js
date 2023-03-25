import React from "react";
import Component from ".";
import { COMPONENT_NAME } from ".";

export const getTitleData = (lang) => {
  return "Referrals/" + COMPONENT_NAME + "/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: Component,
  excludeStories: /.*Data$/,
};

export const defaultState = (extraData) => {
  return <Component {...extraData} />;
};
