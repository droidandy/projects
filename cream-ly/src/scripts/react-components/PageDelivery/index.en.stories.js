import * as stories from "./index.stories";

const lang = "en";

export default {
  title: stories.getTitleData(lang),
};

export const defaultState = (props) => stories.defaultState({ ...props, lang });
export const USWithMatchedCountry = (props) => stories.USWithMatchedCountry({ ...props, lang });
export const USNoMatchedCountry = (props) => stories.USNoMatchedCountry({ ...props, lang });
export const UK = (props) => stories.UK({ ...props, lang });
export const REST = (props) => stories.REST({ ...props, lang });