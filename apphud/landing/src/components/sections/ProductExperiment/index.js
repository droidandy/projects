import React from "react";
import styles from "./styles.module.scss";

const ProductExperiment = ({ title, text, img }) => {
  return (
    <div className="container container_xs">
      <div className={styles.experiment}>
        <div className={styles.text}>
          <label className="h4">{title}</label>
          <p className="text_xl">{text}</p>
        </div>
        <div className={styles.img}>
          <img src={img} alt={title} />
        </div>
      </div>
    </div>
  );
};

export default ProductExperiment;
