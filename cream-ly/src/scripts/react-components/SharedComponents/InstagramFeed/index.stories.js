import React from "react";

import { action, actions } from "@storybook/addon-actions";

import InstagramFeedback from ".";

export default {
  title: "Sections/InstagramFeedback",
  component: InstagramFeedback,
};

export const defaultState = () => <InstagramFeedback />;

export const english = () => <InstagramFeedback lang="en" />;
