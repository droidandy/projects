import React from "react";
import PageDelivery from ".";

export const getTitleData = (lang) => {
  return "Pages/PageDelivery/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: PageDelivery,
  excludeStories: /.*Data$/,
};

export const stateDefaultData = {
  regionCode: "EU",
};
export const defaultState = (extraProps) => (
  <PageDelivery {...stateDefaultData} {...extraProps} />
);

export const stateUSData = {
  regionCode: "US",
  countryCode: "US",
};
export const USWithMatchedCountry = (extraProps) => (
  <PageDelivery {...stateUSData} {...extraProps} />
);

export const USNoMatchedCountry = (extraProps) => (
  <PageDelivery {...stateUSData} countryCode="" {...extraProps} />
);

export const stateBYData = {
  regionCode: "BY",
  countryCode: "BY",
};
export const BY = (extraProps) => (
  <PageDelivery {...stateBYData} {...extraProps} />
);

export const stateRUData = {
  regionCode: "RU",
  countryCode: "RU",
  provinceCode: "MOW",
};
export const RUWithMatchedProvince = (extraProps) => (
  <PageDelivery {...stateRUData} {...extraProps} />
);

export const RUNoMatchedProvince = (extraProps) => (
  <PageDelivery {...stateRUData} provinceCode="" {...extraProps} />
);

export const stateUAData = {
  regionCode: "UA",
  countryCode: "UA",
};
export const UA = (extraProps) => (
  <PageDelivery {...stateUAData} {...extraProps} />
);


export const stateUKData = {
  regionCode: "UK",
  countryCode: "UK",
};
export const UK = (extraProps) => (
  <PageDelivery {...stateUKData} {...extraProps} />
);

export const stateRESTData = {
  regionCode: "REST",
  countryCode: "",
};
export const REST = (extraProps) => (
  <PageDelivery {...stateRESTData} {...extraProps} />
);