import React from "react";
import { action } from "@storybook/addon-actions";

import Form from ".";

const lang = "ru";

export const getTitleData = (lang) => {
  return (
    "Sections/Localization/PreferencesModal/sections/Form/" + lang.toUpperCase()
  );
};

export default {
  title: getTitleData(lang),
  component: Form,
  excludeStories: /.*Data$/,
};

const mockActionOnSaveData = (regionCode, currencyCode, languageCode) => {
  action("onSubmit")(
    `mockActionOnSaveData, ${regionCode}, ${currencyCode}, ${languageCode}`
  );
};

const mockActionOnCancelData = () => {
  action("onSubmit")(`mockActionOnCancelData`);
};

export const actionsData = {
  actionOnSave: mockActionOnSaveData,
  actionOnCancel: mockActionOnCancelData,
};

export const setDefaultPropsData = (regionCode, currencyCode) => {
  return {
    regionCode,
    currencyCode,
    freeAmount: 1000,
    deliveryCost: 500,
    paymentOptions: {},
  };
};
export const EU = (extraProps) => {
  const lang = extraProps.lang || "ru";
  return (
    <Form
      {...extraProps}
      {...setDefaultPropsData("EU", "EUR")}
      {...actionsData}
      regionPopupVisibility
    />
  );
};
export const EU_USD = (extraProps) => {
  const lang = extraProps.lang || "ru";
  return (
    <Form
      {...extraProps}
      {...setDefaultPropsData("EU", "USD")}
      {...actionsData}
      regionPopupVisibility
    />
  );
};
export const RU = (extraProps) => {
  const lang = extraProps.lang || "ru";
  return (
    <Form
      {...extraProps}
      {...setDefaultPropsData("RU", "RUB")}
      {...actionsData}
      regionPopupVisibility
    />
  );
};

export const BY = (extraProps) => {
  const lang = extraProps.lang || "ru";
  return (
    <Form
      {...extraProps}
      {...setDefaultPropsData("BY", "BYN")}
      {...actionsData}
      regionPopupVisibility
    />
  );
};

export const UA = (extraProps) => {
  const lang = extraProps.lang || "ru";
  return (
    <Form
      {...extraProps}
      {...setDefaultPropsData("UA", "UAH")}
      {...actionsData}
      regionPopupVisibility
    />
  );
};
