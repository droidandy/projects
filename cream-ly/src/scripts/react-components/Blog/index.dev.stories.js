import React from "react";

import Blog from "./index";

const lang = "dev";
export const getTitleData = (lang) => {
  return `Pages/Blog/${lang.toUpperCase()}`;
};
export default {
  title: getTitleData(lang),
  component: Blog,
  excludeStories: /.*Data$/,
};
export const Main = (extraData) => <Blog {...extraData} lang={lang} />;
