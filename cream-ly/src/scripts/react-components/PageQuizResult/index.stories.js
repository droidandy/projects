import React from "react";

import { action, actions } from "@storybook/addon-actions";

import PageQuizResult from "./index";

const lang = "ru";
export const getTitleData = (lang) => {
  return "Pages/PageQuizResult/" + lang.toUpperCase();
};

export default {
  title: getTitleData(lang),
  component: PageQuizResult,
  excludeStories: /.*Data$/,
};

export const allProductsData = {
  onSelectUpdate: action("onSelectUpdate"),
  onAddToCart: action("onAddToCart"),

  videoGoals: [],
  quiz: {
    skinCareGoals: ["edema", "wrinkles"],
    skinType: ["normal"],
  },
  note: "here goes my important comment",
  recommendedSKUs: [
    "SKU-flower-powder",
    "SKU-exfoliate",
    "SKU-cream-my-body",
    "brush-my-body",
    "SKU-oil-normal-mixed-oily",
    "SKU-oil-dry-aged",
    "SKU-cream-sensitive",
    "SKU-cream-normal-mixed-oily",
    "SKU-cream-acne",
    "SKU-cream-peptides",

    "Video-FaceMassage-Level1",
    "Video-Limfa-Level2",
    "Video-Osanka-Level3",
    "Video-Level4-buccal-massage",
    "Video-Level5-guasha-massage",
    "Video-Level6-cellulite-massage",
    "Video-Level7-mewing",
    "sku-video-aging",
    "SKU-clean-my-skin",
  ],
  selectedProductsSKU: [
    "SKU-flower-powder",
    "SKU-exfoliate",
    "SKU-cream-my-body",
    "brush-my-body",
    "SKU-oil-normal-mixed-oily",
    "SKU-oil-dry-aged",
    "SKU-cream-sensitive",
    "SKU-cream-normal-mixed-oily",
    "SKU-cream-acne",
    "SKU-cream-peptides",
    "SKU-clean-my-skin",
  ],
};

export const allPossibleVariants = (props) => {
  console.log("props", props);

  return <PageQuizResult {...allProductsData} isDisplaySKU={true} {...props} />;
};

export const twoOptionsOnly = (props) => {
  return (
    <PageQuizResult
      {...allProductsData}
      quiz={{ skinCareGoals: ["wrinkles"], skinType: ["normal"] }}
      {...props}
    />
  );
};

const partiallySelectedData = {
  ...allProductsData,
  selectedProductsSKU: [
    "SKU-flower-powder",
    "SKU-exfoliate",
    "SKU-cream-my-body",
  ],
};
export const partiallySelected = (props) => {
  return <PageQuizResult {...props} {...partiallySelectedData} />;
};

const noSelectedProductsData = {
  ...allProductsData,
  selectedProductsSKU: [],
};

export const noSelectedProducts = (props) => {
  return <PageQuizResult {...props} {...noSelectedProductsData} />;
};

const hidePurchasedVideosData = {
  ...allProductsData,
  purchasedVideosHandles: ["video-1", "video-2-limfa"],
};
export const hidePurchasedVideos = (props) => {
  return <PageQuizResult {...props} {...hidePurchasedVideosData} />;
};
