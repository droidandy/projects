import React from "react";
import PageAbout from ".";

export const getTitleData = (lang) => {
  return "Pages/About/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: PageAbout,
  excludeStories: /.*Data$/,
};

export const defaultPage = (extraData) => {
  return <PageAbout {...extraData} />;
};
