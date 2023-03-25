import React from "react";
import ContactUs from ".";
import { action } from "@storybook/addon-actions";

const lang = "ru";
export const getTitleData = (lang) => {
  return "Pages/ContactUs/" + lang.toUpperCase();
};

export default {
  title: getTitleData(lang),
  component: ContactUs,
  excludeStories: /.*Data$/,
};
const actionOnSubmit = ({ name, email, phoneNumber, message }) => {
  action("onSubmit")(`
    actionOnSubmit 
    name: ${name}, 
    email: ${email}, 
    phoneNumber: ${phoneNumber}, 
    message: ${message}
  `);
};
const data = {
  lang,
  actionOnSubmit,
};
export const defaultState = (extraData) => (
  <ContactUs {...data} {...extraData} />
);

const filledInData = {
  ...data,
  name: "Ivan Иванов",
  email: "email@email.com",
  phone: "+12344556789",
  message: "hello boys and girls..",
};
export const filledIn = (extraData) => (
  <ContactUs {...filledInData} {...extraData} />
);

const errorData = {
  ...data,
  errors: [
    {
      type: "global",
      text: "Я текстовая ошибка с сервера - там все плохо",
    },
  ],
};
export const error = (extraData) => {
  const lang = extraData.lang ? extraData.lang : errorData.lang;
  return <ContactUs {...errorData} lang={lang} />;
};
const sentData = {
  ...data,
  isSent: true,
};
export const sent = (extraData) => <ContactUs {...sentData} {...extraData} />;

const loadingData = {
  ...data,
  isLoading: true,
};
export const loading = (extraData) => (
  <ContactUs {...loadingData} {...extraData} />
);
