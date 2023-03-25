import React from "react";
import styles from "./styles.module.scss";

const Tab3 = () => {
  return (
    <>
      <div className={styles.content}>
        <label className="subheader-medium h4">
          Run experiments to find the optimal subscription price
          <span>soon</span>
        </label>
        <p className="text text_xl">
          Test different in-app purchases on paywall. Run experiments to find a
          subscription price that maximizes ROI.
        </p>
        <a href="/product" className="link">
          Learn about Apphud for product
        </a>
      </div>

      <div>
        <img src={require("../images/img3.svg")} alt="Run experiments to find the optimal subscription price soon"/>
      </div>
    </>
  );
};

export default Tab3;
