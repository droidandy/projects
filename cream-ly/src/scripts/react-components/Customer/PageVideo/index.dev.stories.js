import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
  parameters: { lang },
};

export const hasAccessVideo1 = (props) => {
  return stories.hasAccessVideo1({ ...props, lang });
};

export const hasAccessVideo2Part2Selected = (props) => {
  return stories.hasAccessVideo2Part2Selected({ ...props, lang });
};

export const noAccess = (props) => {
  return stories.noAccess({ ...props, lang });
};
export const notLogin = (props) => {
  return stories.notLogin({ ...props, lang });
};
