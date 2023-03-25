import React from "react";
import PageProductDetails from ".";

import * as stories from "./index.stories";

const lang = "lv";

export default {
  title: stories.getTitleData(lang),
  component: PageProductDetails,
  excludeStories: /.*Data$/,
  parameters: { lang },
};

export const recommended = (extraProps) => {
  return stories.recommended({ ...extraProps, lang });
};

export const OutOfStock = (extraProps) => {
  return stories.OutOfStock({ ...extraProps, lang });
};

export const FlowerMyPowder = (extraProps) => {
  return stories.FlowerMyPowder({ ...extraProps, lang });
};

export const CreamMySkinNoVariant = (extraProps) => {
  return stories.CreamMySkinNoVariant({ ...extraProps, lang });
};

export const CreamMySkinSKUCreamSensitive = (extraProps) => {
  return stories.CreamMySkinSKUCreamSensitive({ ...extraProps, lang });
};

export const CreamMySkinSKUCreamNormalMixedOily = (extraProps) => {
  return stories.CreamMySkinSKUCreamNormalMixedOily({ ...extraProps, lang });
};

export const CreamMySkinSKUCreamAcne = (extraProps) => {
  return stories.CreamMySkinSKUCreamAcne({ ...extraProps, lang });
};

export const CreamMySkinSKUCreamWithPeptides = (extraProps) => {
  return stories.CreamMySkinSKUCreamWithPeptides({ ...extraProps, lang });
};

export const NourishMySkinNoVariant = (extraProps) => {
  return stories.NourishMySkinNoVariant({ ...extraProps, lang });
};
export const NourishMySkinSKUOilNormalMixedOily = (extraProps) => {
  return stories.NourishMySkinSKUOilNormalMixedOily({ ...extraProps, lang });
};

export const NourishMySkinSKUOilDryAged = (extraProps) => {
  return stories.NourishMySkinSKUOilDryAged({ ...extraProps, lang });
};

export const Exfoliate = (extraProps) => {
  return stories.Exfoliate({ ...extraProps, lang });
};

export const CreamMyBody = (extraProps) => {
  return stories.CreamMyBody({ ...extraProps, lang });
};

export const CreamMyBodyAtopic = (extraProps) => {
  return stories.CreamMyBodyAtopic({ ...extraProps, lang });
};

export const BrushMyBody = (extraProps) => {
  return stories.BrushMyBody({ ...extraProps, lang });
};
export const GiftCard = (extraProps) => {
  return stories.GiftCard({ ...extraProps, lang });
};

export const Robe = (extraProps) => {
  return stories.Robe({ ...extraProps, lang });
};

export const Headband = (extraProps) => {
  return stories.Headband({ ...extraProps, lang });
};

export const Candle = (extraProps) => {
  return stories.Candle({ ...extraProps, lang });
};
