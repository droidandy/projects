import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
};

export const defaultState = (props) => {
  return stories.defaultState({ ...props, lang });
};

export const withEmail = (props) => {
  return stories.withEmail({ ...props, lang });
};

export const withError = (props) => {
  return stories.withError({ ...props, lang });
};
export const sentState = (props) => {
  return stories.sentState({ ...props, lang });
};
