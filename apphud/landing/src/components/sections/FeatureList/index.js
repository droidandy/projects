import React from "react";
import styles from "./styles.module.scss";

const Feature = ({ img, title, text }) => {
  return (
    <div className={styles.feature}>
      <img src={img} alt={title} />
      <label className="subheader-medium h4">{title}</label>
      <p className="text text_xl" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};

const FeatureList = ({ children }) => {
  return (
    <div className={styles.featureList}>
      <div className="container">
        <div className={styles.list}>{children}</div>
      </div>
    </div>
  );
};

export { FeatureList, Feature };
