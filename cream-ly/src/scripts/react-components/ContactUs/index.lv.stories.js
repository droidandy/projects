import * as stories from "./index.stories";

const lang = "lv";

export default {
  title: stories.getTitleData(lang),
};

export const defaultState = (props) => stories.defaultState({ ...props, lang });

export const filledIn = (props) => stories.filledIn({ ...props, lang });

export const error = (props) => stories.error({ ...props, lang });

export const sent = (props) => stories.sent({ ...props, lang });

export const loading = (props) => stories.loading({ ...props, lang });
