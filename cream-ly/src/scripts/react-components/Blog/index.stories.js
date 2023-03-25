import React from "react";
import { blogArticles } from "@Core/api/shopify.storefront/blog/index";
import Blog from "./index";

const lang = "ru";
export const getTitleData = (lang) => {
  return `Pages/Blog/${lang.toUpperCase()}`;
};
export default {
  title: getTitleData(lang),
  component: Blog,
  excludeStories: /.*Data$/,
};
export const Main = (extraData) => <Blog articles={blogArticles} {...extraData} />;
