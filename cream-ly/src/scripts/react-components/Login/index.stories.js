import React from "react";
import Login from ".";
import { action } from "@storybook/addon-actions";

const lang = "ru";
export const getTitleData = (lang) => {
  return "Pages/Login/" + lang.toUpperCase();
};

const actionSubmitLoginForm = ({ email, password }) => {
  action("onSubmit")(
    `actionSubmitLoginForm email: ${email} password: ${password}`
  );
};
const actionSubmitForgetPassword = ({ email }) => {
  action("onSubmit")(`actionSubmitForgetPassword email: ${email}`);
};
const actionGoToReturnURL = (url) => {
  action("onClick")(`actionGoToReturnURL ${url}`);
};
const actionGoToRegistration = () => {
  action("onClick")(`actionGoToRegistration`);
};
export default {
  title: getTitleData(lang),
  component: Login,
  excludeStories: /.*Data$/,
};

const data = {
  lang,
  errors: [],
  actionSubmitLoginForm,
  actionGoToReturnURL,
  actionGoToRegistration,
  actionSubmitForgetPassword,
};
export const defaultState = (extraData) => <Login {...data} {...extraData} />;

export const emailIsSetData = {
  ...data,
  email: "email@gmail.com",
};

export const emailIsSet = (extraData) => (
  <Login {...emailIsSetData} {...extraData} />
);

export const formErrors = (extraData) => (
  <Login
    {...data}
    {...extraData}
    errors={[
      {
        type: "global",
        text: "Login:errors.signinError",
      },
    ]}
  />
);

export const backAsGuestData = {
  ...data,
  returnURL: "/checkout/...",
};

export const backAsGuest = (extraData) => (
  <Login {...backAsGuestData} {...extraData} />
);

export const forgetPasswordData = {
  ...data,
  isRecoveryModeOn: true,
  email: "email@gmail.com",
};

export const forgetPassword = (extraData) => (
  <Login {...forgetPasswordData} {...extraData} />
);

export const forgetPasswordSentData = {
  ...data,
  isRecoveryModeOn: true,
  isSent: true,
  email: "email@gmail.com",
};

export const forgetPasswordSent = (extraData) => (
  <Login {...forgetPasswordSentData} {...extraData} />
);

export const forgetPasswordLoadingData = {
  ...data,
  isRecoveryModeOn: true,
  isLoading: true,
};

export const forgetPasswordLoading = (extraData) => (
  <Login {...forgetPasswordLoadingData} {...extraData} />
);

export const forgetPasswordErrorData = {
  ...data,
  isRecoveryModeOn: true,
  email: "email@gmail.com",
};

export const forgetPasswordError = (extraData) => (
  <Login
    {...forgetPasswordErrorData}
    {...extraData}
    serverErrors={[
      {
        code: "UNIDENTIFIED_CUSTOMER",
        field: ["email"],
        message: "Could not find customer",
      },
    ]}
  />
);
