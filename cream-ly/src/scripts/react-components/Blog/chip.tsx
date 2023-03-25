import React from 'react';
import MuiChip from "@material-ui/core/Chip";

import "./index.scss";

interface ChipProps {
  label: string;
  value?: any;
  handleClick: (value: string) => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

const Chip = ({
  label,
  value = null,
  handleClick,
  disabled = false,
  active = false,
  className = "",
}: ChipProps) => {
  const innerValue = value || label;
  return (
    <MuiChip
      label={label}
      clickable
      onClick={(event) => {
        event.stopPropagation();
        handleClick(innerValue);
      }}
      className={`tag ${className}`}
      variant={active ? "default" : "outlined"}
      disabled={disabled}
    />
  );
};

export default Chip;
