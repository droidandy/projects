import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
};

export const defaultState = (props) => {
  return stories.defaultState({ ...props, lang });
};
