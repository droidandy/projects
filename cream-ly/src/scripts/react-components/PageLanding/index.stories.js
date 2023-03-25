import React from "react";
import PageLanding from ".";

export const getTitleData = (lang) => {
  return "Pages/Landing/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: PageLanding,
  excludeStories: /.*Data$/,
};

export const defaultPage = (extraData) => {
  return <PageLanding {...extraData} />;
};
