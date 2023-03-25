import React from "react";

import { action, actions } from "@storybook/addon-actions";

import Header from "./index";

export default {
  title: "@Components/Structure/Header",
  component: Header,
};

const props = {
  text: "header text...",
};

export const deafultHeader = () => <Header {...props} />;
