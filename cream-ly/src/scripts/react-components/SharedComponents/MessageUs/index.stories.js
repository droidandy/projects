import React from "react";

import {action, actions} from "@storybook/addon-actions";

import MessageUs from "./index";

export default {
  title: "Sections/MessageUs",
  component: MessageUs
};

export const defaultMessageUs = () => <MessageUs />;

export const english = () => <MessageUs lang="en" />;
