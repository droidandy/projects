import React from "react";

import { action, actions } from "@storybook/addon-actions";

import Button from "./index";

export default {
  title: "@Components/Structure/Button",
  component: Button,
};

const props = {
  text: "button text...",
};

export const defaultButton = () => (
  <Button {...props} onClick={action("onClick")} />
);

export const green = () => (
  <Button {...props} green={true} onClick={action("onClick")} />
);

export const greenBorder = () => (
  <Button {...props} greenBorder={true} onClick={action("onClick")} />
);

export const rose = () => (
  <Button {...props} rose={true} onClick={action("onClick")} />
);

export const white = () => (
  <Button {...props} white={true} onClick={action("onClick")} />
);

export const disabled = () => (
  <Button {...props} disabled={true} onClick={action("onClick")} />
);

export const isLoading = () => (
  <Button {...props} onClick={action("onClick")} isLoading={true} />
);
