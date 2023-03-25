import React from "react";
import HomePromoMain from ".";

export const getTitleData = (lang) => {
  return "Pages/HomePage/" + lang.toUpperCase() + "/PromoMain";
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: HomePromoMain,
  excludeStories: /.*Data$/,
};

export const defaultState = (extraProps) => {
  return <HomePromoMain {...extraProps} />;
};

export const variant2021feb = (extraProps) => {
  return <HomePromoMain {...extraProps} variant={"variant2021feb"} />;
};

export const newYear1Data = {
  variant: "newyear2020v1",
};
export const newYear1 = (extraProps) => {
  return <HomePromoMain {...newYear1Data} {...extraProps} />;
};

export const newYear2Data = {
  variant: "newyear2020v2",
};
export const newYear2 = (extraProps) => {
  return <HomePromoMain {...newYear2Data} {...extraProps} />;
};

export const newYear2022 = (extraProps) => {
  return <HomePromoMain variant="newyear2022" {...extraProps} />;
};
