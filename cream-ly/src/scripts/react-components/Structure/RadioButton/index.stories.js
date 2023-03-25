import React, { useState } from "react";

import { action } from "@storybook/addon-actions";

import RadioButton from "./index";

export default {
  title: "@Components/Structure/RadioButton",
  component: RadioButton,
};

const props = {
  label: "label text...",
  checked: false,
  id: "test",
  handleChange: action("onChange"),
};

const Wrapper = ({ children }) => <div className="m-5">{children}</div>;
export const RadioButtonVariants = () => (
  <Wrapper>
    <RadioButton {...props} />
    <RadioButton {...props} checked />
    <RadioButton {...props} disabled />
    <RadioButton {...props} checked disabled />
  </Wrapper>
);
