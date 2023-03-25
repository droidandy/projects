import * as stories from "./index.stories";

const lang = "en";

export default {
  title: stories.getTitleData(lang),
  parameters: { lang },
};

export const defaultState = (props) => {
  return stories.defaultState({ ...props, lang });
};
