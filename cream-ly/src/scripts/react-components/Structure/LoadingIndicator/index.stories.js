import React from "react";

import { action, actions } from "@storybook/addon-actions";

import LoadingIndicator from "./index";

export default {
  title: "@Components/Structure/LoadingIndicator",
  component: LoadingIndicator,
};

export const indicator = () => <LoadingIndicator />;
