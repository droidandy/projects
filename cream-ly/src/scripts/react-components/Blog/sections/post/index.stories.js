import React from "react";
import { blogArticles } from "@Core/api/shopify.storefront/blog/index";
import Post from "./index";

const lang = "dev";
export const getTitleData = (lang) => {
  return `Pages/Blog/${lang.toUpperCase()}`;
};
export default {
  title: getTitleData(lang),
  component: Post,
  excludeStories: /.*Data$/,
};
export const Article = extraData => (
  <Post handle="kak-ubrat-chernie-tochki" lang={lang} {...extraData} articles={blogArticles} />
);
