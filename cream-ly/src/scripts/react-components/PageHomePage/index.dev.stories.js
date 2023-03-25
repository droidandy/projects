import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
};

export const defaultPage = (props) => {
  return stories.defaultPage({ ...props, lang });
};

export const withQuizResults = (props) => {
  return stories.withQuizResults({ ...props, lang });
};

export const hideFreeVideoPromo = (props) => {
  return stories.hideFreeVideoPromo({ ...props, lang });
};
