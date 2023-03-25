import React from "react";

import { action, actions } from "@storybook/addon-actions";

import SubHeader from "./index";

export default {
  title: "@Components/Structure/SubHeader",
  component: SubHeader,
};

const props = {
  text: "sub-header text...",
};

export const deafultSubHeader = () => <SubHeader {...props} />;
