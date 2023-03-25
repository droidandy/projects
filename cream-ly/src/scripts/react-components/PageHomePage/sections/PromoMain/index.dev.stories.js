import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
  parameters: { lang },
};

export const defaultState = (props) => {
  return stories.defaultState({ ...props, lang });
};

export const newYear1 = (props) => {
  return stories.newYear1({ ...props, lang });
};

export const newYear2 = (props) => {
  return stories.newYear2({ ...props, lang });
};
