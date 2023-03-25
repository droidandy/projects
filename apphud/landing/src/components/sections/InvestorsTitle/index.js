import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const InvestorsTitle = ({ title, text }) => {
  return (
    <div className={cn(styles.title)}>
      <div className="container">
        <h1>{title}</h1>
        <p className="text_xl">{text}</p>
      </div>
    </div>
  );
};

export default InvestorsTitle;
