import * as stories from "./index.stories";

const lang = "en";

export default {
  title: stories.getTitleData(lang),
};

export const defaultState = (props) => stories.defaultState({ ...props, lang });

export const error = (props) => stories.error({ ...props, lang });

export const complete = (props) => stories.complete({ ...props, lang });
