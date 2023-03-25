import React from "react";

import * as stories from "./index.stories";

const lang = "en";

export default {
  title: stories.getTitleData(lang),
};

export const defaultRegion = (extraProps) => {
  return stories.defaultRegion({ ...extraProps, lang });
};

export const shopRegion = (extraProps) => {
  return stories.shopRegion({ ...extraProps, lang });
};
