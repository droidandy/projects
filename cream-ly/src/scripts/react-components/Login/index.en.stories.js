import * as stories from "./index.stories";

const lang = "en";

export default {
  title: stories.getTitleData(lang),
};

export const defaultState = (props) => stories.defaultState({ ...props, lang });

export const emailIsSet = (props) => stories.emailIsSet({ ...props, lang });

export const formErrors = (props) => stories.formErrors({ ...props, lang });

export const backAsGuest = (props) => stories.backAsGuest({ ...props, lang });

export const forgetPassword = (props) =>
  stories.forgetPassword({ ...props, lang });

export const forgetPasswordSent = (props) =>
  stories.forgetPasswordSent({ ...props, lang });

export const forgetPasswordError = (props) =>
  stories.forgetPasswordError({ ...props, lang });
