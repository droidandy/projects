import * as stories from "./index.stories";

const lang = "lv";

export default {
  title: stories.getTitleData(lang),
};

export const defaultPage = (props) => {
  return stories.defaultPage({ ...props, lang });
};
