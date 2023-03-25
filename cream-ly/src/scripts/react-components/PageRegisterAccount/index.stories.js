import React from "react";
import PageRegisterAccount from ".";
import { action } from "@storybook/addon-actions";

const lang = "ru";
export const getTitleData = (lang) => {
  return "Pages/PageRegisterAccount/" + lang.toUpperCase();
};

const actionOnSubmit = ({ firstName, lastName, email, password }) => {
  action("onSubmit")(
    `actionOnSubmit 
    firstName: ${firstName}, 
    lastName: ${lastName}, 
    email: ${email}, 
    password: ${password}`
  );
};
export default {
  title: getTitleData(lang),
  component: PageRegisterAccount,
  excludeStories: /.*Data$/,
};
const data = {
  lang,
  errors: [],
};

export const defaultState = (extraData) => (
  <PageRegisterAccount
    {...data}
    {...extraData}
    actionOnSubmit={actionOnSubmit}
  />
);

const errorData = {
  ...data,
  firstName: "firstName",
  lastName: "lastName",
  email: "email@email.com",
  password: "12345",
  serverErrors: [
    {
      code: "CUSTOMER_DISABLED",
      field: null,
      message:
        "Мы отправили электронное письмо на адрес nick+test@cream.ly. Перейдите по ссылке, чтобы подтвердить адрес электронной почты.",
    },
    {
      code: "TAKEN",
      field: ["input", "email"],
      message: "Email has already been taken",
    },
    // {
    //   code: "TOO_SHORT",
    //   field: ["input", "password"],
    //   message:
    //     "пароль слишком короткое (должно содержать по крайней мере 5 симв.)",
    // },
  ],
};
export const error = (extraData) => (
  <PageRegisterAccount
    {...errorData}
    {...extraData}
    actionOnSubmit={actionOnSubmit}
  />
);

const completeData = {
  ...data,
  isComplete: true,
};
export const complete = (extraData) => (
  <PageRegisterAccount {...completeData} {...extraData} />
);

const loadingData = {
  ...data,
  isLoading: true,
};
export const loading = (extraData) => (
  <PageRegisterAccount {...loadingData} {...extraData} />
);
