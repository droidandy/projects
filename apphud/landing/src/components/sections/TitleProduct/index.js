import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const TitleProduct = ({ title, text, actions, icon }) => {
  return (
    <div className={cn(styles.title, { icon })}>
      <div className="container">
        {icon && (
          <div className={styles.icon}>
            <img src={icon} alt={title} />
          </div>
        )}
        <h1>{title}</h1>
        <p className="text_xl">{text}</p>

        <div className={styles.actions}>{actions}</div>
      </div>
    </div>
  );
};

export default TitleProduct;
