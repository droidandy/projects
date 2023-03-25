import React from "react";
import FAQ from ".";

export const getTitleData = lang => {
  return "Pages/FAQ/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: FAQ,
  excludeStories: /.*Data$/
};

export const defaultState = extraData => {
  return <FAQ {...extraData} />;
};
export const shortFAQ = extraData => {
  return <FAQ {...extraData} isShortFaq />;
};
export const noSearchResults = extraData => {
  return (
    <FAQ
      {...extraData}
      initialSearchQuery="abrakadabra"
    />
  );
};

export const withSearchResults = extraData => {
  return (
    <FAQ
      {...extraData}
      initialSearchQuery="flower"
    />
  );
};
