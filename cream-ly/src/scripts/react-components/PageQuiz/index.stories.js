import React from "react";

import { action, actions } from "@storybook/addon-actions";

import Quiz from "./index";

export const getTitleData = (lang) => {
  return "Pages/PageQuiz/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: Quiz,
  excludeStories: /.*Data$/,
};

const actionGroup = {
  onClick: action("onClick"),
  onSelect: action("onSelect"),
  onUnselect: action("onUnselect"),
  onChange: action("onChange"),
  actionSaveQuiz: action("actionSaveQuiz"),
  onError: action("onError"),
};

export const empty = (extraProps) => <Quiz {...actionGroup} {...extraProps} />;
export const emptyWithError = (extraProps) => (
  <Quiz {...actionGroup} isButtonClicked={true} {...extraProps} />
);
export const preFilled = (extraProps) => (
  <Quiz
    {...actionGroup}
    skinType="mixed"
    skinGoals={["acne", "body"]}
    comment="my comment goes here"
    {...extraProps}
  />
);
