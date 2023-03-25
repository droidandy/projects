import React from "react";

import { action, actions } from "@storybook/addon-actions";

import ConsultationPromo from "./index";

const storybookData = {
  title: "Sections/ConsultationPromo",
  component: ConsultationPromo,
};

export default storybookData;

const actionGroup = {
  onClick: action("onClick"),
};

export const empty = (extraProps) => (
  <ConsultationPromo {...actionGroup} {...extraProps} />
);
