import React from "react";

import { action, actions } from "@storybook/addon-actions";

import PageProductDetails from ".";
import * as Products from "@Core/products";

const actionClickOnBuyButton = (variantId, skinType, skinGoals) => {
  action("actionClickOnBuyButton");
};

const lang = "ru";

export const getTitleData = (lang) => {
  return `Pages/ProductDetails/States/${lang.toUpperCase()}`;
};
export default {
  title: getTitleData(lang),
  component: PageProductDetails,
  excludeStories: /.*Data$/,
};
const videosData = [{ vimeoId: 401635269 }, { vimeoId: 401635269 }];

const quizData = {
  skinType: "dry",
  goals: ["wrinkles", "pimple"],
  productHandle: "cream-my-skin-with-peptides",
};

const defaultPageData = {
  handle: "cream-my-skin",
  product: {
    isRecommended: false,
    isOutOfStock: false,
    videosList: videosData,
  },
  actionClickOnBuyButton,
  lang,
};

const recommendedData = {
  ...defaultPageData,
  sizeInML: 50,
  product: {
    ...defaultPageData.product,
    isRecommended: true,
  },
};

export const recommended = (extraProps) => (
  <PageProductDetails {...recommendedData} {...extraProps} />
);

const OutOfStockData = {
  ...defaultPageData,
  product: {
    ...defaultPageData.product,
    isOutOfStock: true,
  },
};

export const OutOfStock = (extraProps) => (
  <PageProductDetails {...OutOfStockData} {...extraProps} />
);

const FlowerMyPowderData = {
  ...defaultPageData,
  handle: "flower-powder-my-skin",
  sku: "SKU-flower-powder",
};

export const FlowerMyPowder = (extraProps) => (
  <PageProductDetails {...FlowerMyPowderData} {...extraProps} />
);

const CreamMySkinNoVariantData = {
  ...defaultPageData,
  handle: "cream-my-skin",
};

export const CreamMySkinNoVariant = (extraProps) => (
  <PageProductDetails {...CreamMySkinNoVariantData} {...extraProps} />
);

const CreamMySkinSKUCreamSensitiveData = {
  ...defaultPageData,
  handle: "cream-my-skin",
  sku: "SKU-cream-sensitive",
};

export const CreamMySkinSKUCreamSensitive = (extraProps) => (
  <PageProductDetails {...CreamMySkinSKUCreamSensitiveData} {...extraProps} />
);

const CreamMySkinSKUCreamNormalMixedOilyData = {
  ...defaultPageData,
  handle: "cream-my-skin",
  sku: "SKU-cream-normal-mixed-oily",
};

export const CreamMySkinSKUCreamNormalMixedOily = (extraProps) => (
  <PageProductDetails
    {...CreamMySkinSKUCreamNormalMixedOilyData}
    {...extraProps}
  />
);

const CreamMySkinSKUCreamAcneData = {
  ...defaultPageData,
  handle: "cream-my-skin",
  sku: "SKU-cream-acne",
};

export const CreamMySkinSKUCreamAcne = (extraProps) => (
  <PageProductDetails {...CreamMySkinSKUCreamAcneData} {...extraProps} />
);

const CreamMySkinSKUCreamWithPeptidesData = {
  ...defaultPageData,
  handle: "cream-my-skin",
  sku: "SKU-cream-peptides",
};

export const CreamMySkinSKUCreamWithPeptides = (extraProps) => (
  <PageProductDetails
    {...CreamMySkinSKUCreamWithPeptidesData}
    {...extraProps}
  />
);

const NourishMySkinNoVariantData = {
  ...defaultPageData,
  handle: "nourish-my-skin",
};

export const NourishMySkinNoVariant = (extraProps) => (
  <PageProductDetails {...NourishMySkinNoVariantData} {...extraProps} />
);

const NourishMySkinSKUOilNormalMixedOilyData = {
  ...defaultPageData,
  handle: "nourish-my-skin",
  sku: "SKU-oil-normal-mixed-oily",
};

export const NourishMySkinSKUOilNormalMixedOily = (extraProps) => (
  <PageProductDetails
    {...NourishMySkinSKUOilNormalMixedOilyData}
    {...extraProps}
  />
);

const NourishMySkinSKUOilDryAgedData = {
  ...defaultPageData,
  handle: "nourish-my-skin",
  sku: "SKU-oil-dry-aged",
};

export const NourishMySkinSKUOilDryAged = (extraProps) => (
  <PageProductDetails {...NourishMySkinSKUOilDryAgedData} {...extraProps} />
);

const ExfoliateData = {
  ...defaultPageData,
  handle: "exfoliate-my-skin",
};

export const Exfoliate = (extraProps) => (
  <PageProductDetails {...ExfoliateData} {...extraProps} />
);

const CreamMyBodyData = {
  ...defaultPageData,
  variants: {
    "SKU-cream-my-body": {
      id: "31960133468214",
      sku: "SKU-cream-my-body",
      title: "CREAM MY BODY",
      isOutOfStock: false,
      price: 58,
    },
    "SKU-cream-my-body-atopic": {
      id: "39294791974966",
      sku: "SKU-cream-my-body-atopic",
      title: "CREAM MY BODY ATOPIC",
      isOutOfStock: false,
      price: 65,
    },
  },
  handle: "cream-my-body",
};

export const CreamMyBody = (extraProps) => (
  <PageProductDetails {...CreamMyBodyData} {...extraProps} />
);

export const CreamMyBodyAtopic = (extraProps) => (
  <PageProductDetails
    {...CreamMyBodyData}
    {...extraProps}
    sku="SKU-cream-my-body-atopic"
  />
);

const BrushMyBodyData = {
  ...defaultPageData,
  handle: "brush-my-body",
};

export const BrushMyBody = (extraProps) => (
  <PageProductDetails {...BrushMyBodyData} {...extraProps} />
);

const GiftCardData = {
  ...defaultPageData,
  handle: "gift-card",
};

const CleanMySkinData = {
  ...defaultPageData,
  handle: "clean-my-skin",
};
export const CleanMySkin = (extraProps) => (
  <PageProductDetails {...CleanMySkinData} {...extraProps} />
);

export const GiftCard = (extraProps) => (
  <PageProductDetails {...GiftCardData} {...extraProps} />
);

const IndividualSkinCareConsultationData = {
  ...defaultPageData,
  handle: "individual-skincare-consultation",
};

export const IndividualSkinCareConsultation = (extraProps) => (
  <PageProductDetails {...IndividualSkinCareConsultationData} {...extraProps} />
);

const IndividualConsultationWithAlenaData = {
  ...defaultPageData,
  handle: "individual-consultation-with-alena",
};

export const IndividualConsultationWithAlena = (extraProps) => (
  <PageProductDetails
    {...IndividualConsultationWithAlenaData}
    {...extraProps}
  />
);

const ConsultationFaceMassageData = {
  ...defaultPageData,
  handle: "individual-face-massage",
};

export const ConsultationFaceMassage = (extraProps) => (
  <PageProductDetails {...ConsultationFaceMassageData} {...extraProps} />
);

const RobeData = {
  ...defaultPageData,
  handle: "robe",
};

export const Robe = (extraProps) => (
  <PageProductDetails {...RobeData} {...extraProps} />
);

const HeadbandData = {
  ...defaultPageData,
  handle: "headband",
};

export const Headband = (extraProps) => (
  <PageProductDetails {...HeadbandData} {...extraProps} />
);

const CandleData = {
  ...defaultPageData,
  handle: "candle",
};

export const Candle = (extraProps) => (
  <PageProductDetails {...CandleData} {...extraProps} />
);
