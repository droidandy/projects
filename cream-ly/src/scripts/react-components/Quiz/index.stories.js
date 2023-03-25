import React from "react";

import {action, actions} from "@storybook/addon-actions";

import Quiz from "./index";

const storybookData = {
  title: "Pages/Quiz",
  component: Quiz
};

export default storybookData;

const actionGroup = {
  onClick: action("onClick"),
  onSelect: action("onSelect"),
  onUnselect: action("onUnselect"),
  onChange: action("onChange"),
  onComplete: action("onComplete"),
  onError: action("onError")
};

export const empty = extraProps => <Quiz {...actionGroup} {...extraProps} />;
export const emptyWithError = extraProps => (
  <Quiz {...actionGroup} isButtonClicked={true} {...extraProps} />
);
export const preFilled = extraProps => (
  <Quiz
    {...actionGroup}
    skinType="mixed"
    skinGoals={["acne", "cellulite"]}
    comment="my comment goes here"
    {...extraProps}
  />
);
