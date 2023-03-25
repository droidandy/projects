import * as stories from "./index.stories";

const lang = "lv";

export default {
  title: stories.getTitleData(lang),
};

export const filled = (props) => stories.filled({ ...props, lang });
