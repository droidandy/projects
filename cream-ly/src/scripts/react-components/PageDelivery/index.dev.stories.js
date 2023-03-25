import * as stories from "./index.stories";

const lang = "dev";

export default {
  title: stories.getTitleData(lang),
};

export const defaultState = (props) => stories.defaultState({ ...props, lang });
export const USWithMatchedCountry = (props) => stories.USWithMatchedCountry({ ...props, lang });
export const USNoMatchedCountry = (props) => stories.USNoMatchedCountry({ ...props, lang });
export const RUWithMatchedProvince = (props) => stories.RUWithMatchedProvince({ ...props, lang });
export const RUNoMatchedProvince = (props) => stories.RUNoMatchedProvince({ ...props, lang });
export const UA = (props) => stories.UA({ ...props, lang });
export const BY = (props) => stories.BY({ ...props, lang });
export const UK = (props) => stories.UK({ ...props, lang });
export const REST = (props) => stories.REST({ ...props, lang });
