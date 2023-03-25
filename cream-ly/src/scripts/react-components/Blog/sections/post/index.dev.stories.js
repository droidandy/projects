import React from "react";
import { blogArticles } from "@Core/api/shopify.storefront/blog/index";
import Post from "./index";

const lang = "ru";
export const getTitleData = (lang) => {
  return `Pages/Blog/${lang.toUpperCase()}`;
};
export default {
  title: getTitleData(lang),
  component: Post,
  excludeStories: /.*Data$/,
};
export const Article = extraData => (
  <Post {...extraData} handle="kak-ubrat-chernie-tochki" articles={blogArticles} />
);
