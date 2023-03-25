import * as stories from "./index.stories";

const lang = "lv";

export default {
  title: stories.getTitleData(lang),
  parameters: { lang },
};

export const allPossibleVariants = (props) => {
  return stories.allPossibleVariants({ ...props, lang });
};

export const twoOptionsOnly = (props) => {
  return stories.twoOptionsOnly({ ...props, lang });
};

export const noSelectedProducts = (props) =>
  stories.noSelectedProducts({ ...props, lang });
