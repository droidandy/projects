import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const AboutHeader = ({ title, text, img }) => {
  return (
    <div className="container">
      <div className={styles.title}>
        <div className={styles.left}>
          <h1>{title}</h1>
          <p className="text_xl">{text}</p>
        </div>
        <div className={styles.right}>
          <img src={img} alt={title} />
        </div>
      </div>
    </div>
  );
};

export default AboutHeader;
