import * as stories from "./index.stories";

const lang = "lv";

export default {
  title: stories.getTitleData(lang),
};

export const empty = (props) => {
  return stories.empty({ ...props, lang });
};

export const emptyWithError = (props) => {
  return stories.emptyWithError({ ...props, lang });
};

export const preFilled = (props) => {
  return stories.preFilled({ ...props, lang });
};
