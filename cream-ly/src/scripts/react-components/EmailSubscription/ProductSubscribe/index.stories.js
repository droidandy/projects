import React from "react";
import ProductForm from ".";

export const getTitleData = (lang) => {
  return "EmailSubscription/ProductForm/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: ProductForm,
  excludeStories: /.*Data$/,
};

export const defaultState = (extraData) => {
  return <ProductForm {...extraData} />;
};

export const withEmail = (extraData) => {
  return <ProductForm email="test@email.com" {...extraData} />;
};

export const withError = (extraData) => {
  return <ProductForm email="test_email.com" {...extraData} />;
};

export const sentState = (extraData) => {
  return <ProductForm isSent={true} {...extraData} />;
};
