import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
  parameters: { lang },
};

export const defaultPage = (props) => {
  return stories.defaultPage({ ...props, lang });
};
