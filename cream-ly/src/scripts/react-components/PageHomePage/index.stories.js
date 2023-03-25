import React from "react";
import PageHomePage from ".";

export const getTitleData = (lang) => {
  return "Pages/HomePage/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: PageHomePage,
  excludeStories: /.*Data$/,
};

export const defaultPage = (extraProps) => {
  return <PageHomePage {...extraProps} fulfillmentCode="RU" />;
};

export const withQuizResultsData = {
  isQuizReady: true,
};
export const withQuizResults = (extraProps) => {
  return <PageHomePage {...withQuizResultsData} {...extraProps} />;
};

export const hideFreeVideoPromoData = {
  customer: {
    videos: ["video-aging"],
  },
};
export const hideFreeVideoPromo = (extraProps) => {
  return <PageHomePage {...hideFreeVideoPromoData} {...extraProps} />;
};
