import React from "react";

import "./index.scss";

interface IRadioButton {
  checked: boolean;
  id: string;
  label: string;
  name: string;
  handleChange: () => void;
  disabled: boolean;
  value: string;
}

const RadioButton = ({
  checked = false,
  id = "id",
  name = "",
  label = "",
  handleChange,
  disabled = false,
  value = "",
}: IRadioButton) => {
  return (
    <div className="radio">
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <label htmlFor={id}>
        <span className="circle" />
        <span className="text">{label}</span>
      </label>
    </div>
  );
};

export default RadioButton;
