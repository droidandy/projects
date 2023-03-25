import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
};

export const defaultState = (props) => stories.emptyCart({ ...props, lang });
