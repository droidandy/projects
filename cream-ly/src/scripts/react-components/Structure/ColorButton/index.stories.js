import React from "react";
import { action } from "@storybook/addon-actions";

import ColorButton from "./index";

export default {
  title: "@Components/Structure/ColorButton",
  component: ColorButton,
};

const props = {
  color: "#d8cfd9",
  active: false,
  disabled: false,
  handleClick: action("onClick"),
  value: "value1",
};

export const defaultColorButton = () => (
  <div style={{ margin: "20px" }}>
    <ColorButton {...props} />
    <ColorButton {...props} color="#e2e7e7" active />
    <ColorButton {...props} color="#f489af" disabled />
  </div>
);
