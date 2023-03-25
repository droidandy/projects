import React from "react";

import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
};
export const Popup = (extraProps) => {
  return stories.Popup({ ...extraProps, lang });
};
