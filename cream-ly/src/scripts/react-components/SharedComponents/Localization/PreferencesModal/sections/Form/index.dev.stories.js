import React from "react";

import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
};

export const EU = (extraProps) => {
  return stories.EU({ ...extraProps, lang });
};
export const EU_USD = (extraProps) => {
  return stories.EU_USD({ ...extraProps, lang });
};
export const BY = (extraProps) => {
  return stories.BY({ ...extraProps, lang });
};

export const RU = (extraProps) => {
  return stories.RU({ ...extraProps, lang });
};
