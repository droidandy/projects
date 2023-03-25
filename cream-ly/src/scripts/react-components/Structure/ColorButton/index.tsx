import React from "react";

import "./index.scss";

interface IColorButton {
  color: string;
  handleClick: (value: string) => void;
  active?: boolean;
  disabled?: boolean;
  value: string;
}

const ColorButton = ({
  color,
  handleClick,
  active,
  disabled,
  value,
}: IColorButton) => {
  return (
    <button
      key={value}
      value={value}
      onClick={(event: any) => handleClick(event.target.value)}
      className={`circle${active ? " circle--active" : ""}`}
      disabled={disabled}
      style={{ backgroundColor: color }}
    />
  );
};

export default ColorButton;
