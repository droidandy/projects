import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const Button = ({
  title,
  type = "button",
  transparent = false,
  border = false,
  disabled = null,
  size = "large",
  className,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        styles.btn,
        size,
        {
          transparent,
          border,
        },
        className
      )}
      type={type}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default Button;
