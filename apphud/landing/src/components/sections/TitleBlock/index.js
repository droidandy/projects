import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const TitleBlock = ({ title, subtitle, nobg }) => {
  return (
    <div className={cn(styles.title, { nobg })}>
      <div className="container">
        <h1>{title}</h1>
        <p className="text_xl">{subtitle}</p>
      </div>
    </div>
  );
};

export default TitleBlock;
