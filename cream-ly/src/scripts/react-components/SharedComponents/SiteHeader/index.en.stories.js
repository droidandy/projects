import * as stories from "./index.stories";

const lang = "en";

export default {
  title: stories.getTitleData(lang),
  parameters: { lang },
};

export const defaultState = (props) => {
  return stories.defaultState({ ...props, lang });
};

export const mobileMenuOpen = (props) => {
  return stories.mobileMenuOpen({ ...props, lang });
};

export const quizNotification = (props) => {
  return stories.quizNotification({ ...props, lang });
};

export const cartNotEmpty = (props) => {
  return stories.cartNotEmpty({ ...props, lang });
};

export const hostCREAMLY_EU = (props) => {
  return stories.hostCREAMLY_EU({ ...props, lang });
};
