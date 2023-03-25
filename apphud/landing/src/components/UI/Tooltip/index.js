import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const Tooltip = ({ title, children }) => {
  return (
    <span className={styles.tooltip}>
      <div className={styles.title}>{title}</div>
      <div className={styles.hint}>{children}</div>
    </span>
  );
};

export default Tooltip;
