import React from "react";

import SuggestionModal from ".";

export const getTitleData = (lang) => {
  return "Sections/Localization/SuggestionModal/" + lang.toUpperCase();
};

const lang = "ru";

const mockActionOnSaveData = (regionCode) => {
  console.log("save", regionCode);
};

const mockActionOnCancelData = () => {
  console.log("cancel");
};

export const actionsData = {
  actionOnSave: mockActionOnSaveData,
  actionOnCancel: mockActionOnCancelData,
};

export default {
  title: getTitleData(lang),
  component: SuggestionModal,
  excludeStories: /.*Data$/,
};

export const defaultRegion = (extraProps) => (
  <SuggestionModal
    modalType="defaultRegion"
    regionCode="EU"
    isShowModal
    {...actionsData}
    {...extraProps}
  />
);

export const shopRegion = (extraProps) => (
  <SuggestionModal
    modalType="shopRegion"
    regionCode="EU"
    isShowModal
    {...actionsData}
    {...extraProps}
  />
);
