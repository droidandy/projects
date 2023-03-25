import React from "react";
import styles from "./styles.module.scss";

const Tab2 = () => {
  return (
    <>
      <div className={styles.content}>
        <label className="subheader-medium h4">Reduce involuntary churn</label>
        <p className="text text_xl">
          If a billing issue occurs, the user will receive a Push-notification
          asking to update their payment details
        </p>
        <a href="/product" className="link">
          Learn about Apphud for product
        </a>
      </div>

      <div>
        <img src={require("../images/img2.svg")} alt="Reduce involuntary churn" />
      </div>
    </>
  );
};

export default Tab2;
