import React from "react";

import { action, actions } from "@storybook/addon-actions";

import ProductsSummaryImages from ".";

const lang = "ru";
export const getTitleData = (lang) => {
  return "Pages/PageQuizResult/sections/ProductsSummaryImages";
};

export default {
  title: getTitleData(lang),
  component: ProductsSummaryImages,
  excludeStories: /.*Data$/,
};

const recommendedProducts = [
  { handle: "cream-my-skin" },
  { handle: "flower-powder-my-skin" },
  { handle: "nourish-my-skin" },
  { handle: "exfoliate-my-skin" },
  { handle: "cream-my-body" },
  { handle: "brush-my-body" },
].map((product) => ({ ...product, sku: product.handle }));

const defaultData = {
  recommendedProducts,
  selectedProductsSKU: recommendedProducts.map((product) => product.sku),
};

export const svgVersion = (props) => {
  return <ProductsSummaryImages isSVG {...defaultData} {...props} />;
};

export const imagesVersion = (props) => {
  return <ProductsSummaryImages {...defaultData} {...props} />;
};
