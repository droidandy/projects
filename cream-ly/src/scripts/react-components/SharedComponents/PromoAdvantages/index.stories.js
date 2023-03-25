import React from "react";
import PromoAdvantages from "./index";

export const getTitleData = (lang) => {
  return "Sections/PromoAdvantages/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: PromoAdvantages,
  excludeStories: /.*Data$/,
};

export const defaultState = (props) => (
  <PromoAdvantages showAnimals={true} {...props} />
);

export const stateWithoutAnimals = (props) => (
  <PromoAdvantages showAnimals={false} {...props} />
);
