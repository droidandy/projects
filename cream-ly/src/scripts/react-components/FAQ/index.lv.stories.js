import * as stories from "./index.stories";

const lang = "lv";

export default {
  title: stories.getTitleData(lang),
};

export const defaultState = (props) => stories.defaultState({ ...props, lang });

export const shortFAQ = (props) => stories.shortFAQ({ ...props, lang });

export const noSearchResults = (props) =>
  stories.noSearchResults({ ...props, lang });

export const withSearchResults = (props) =>
  stories.withSearchResults({ ...props, lang });
