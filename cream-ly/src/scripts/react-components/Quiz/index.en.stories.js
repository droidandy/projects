import * as Stories from "./index.stories";

const extraProps = {lang: "en"};

const storybookData = {
  ...Stories.default,
  title: Stories.default.title + "/Translations/" + extraProps.lang
};

export default storybookData;

export const empty = () => Stories.empty(extraProps);
export const emptyWithError = () => Stories.emptyWithError(extraProps);
export const preFilled = () => Stories.preFilled(extraProps);
