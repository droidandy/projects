import * as stories from "./index.stories";

const lang = "en";

export default {
  title: stories.getTitleData(lang),
};

export const defaultState = (props) => {
  return stories.defaultState({ ...props, lang });
};

export const userLoggedIn = (props) => {
  return stories.userLoggedIn({ ...props, lang });
};
