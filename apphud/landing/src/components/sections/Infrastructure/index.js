import React from "react";
import styles from "./styles.module.scss";

const Infrastructure = () => {
  return (
    <div className={styles.infrastructure}>
      <div className="container">
        <h2>The complete infrastructure for in-app subscriptions</h2>

        <div className={styles.list}>
          <div className={styles.item}>
            <img src={require("./build.svg")} alt="Build" />
            <label className="subheader-medium h4">Build</label>
            <p className="text text_xl">
              Integrate in-app purchases and subscriptions in your mobile app in
              2 lines of code. No server code required.
            </p>
          </div>

          <div className={styles.item}>
            <img src={require("./measure.svg")} alt="Measure" />
            <label className="subheader-medium h4">Measure</label>
            <p className="text text_xl">
              Powerful revenue and user acquisition analytics. Integrations with
              mobile analytics, marketing platforms and messengers.
            </p>
          </div>

          <div className={styles.item}>
            <img src={require("./grow.svg")} alt="Grow" />
            <label className="subheader-medium h4">Grow</label>
            <p className="text text_xl">
              Run in-app purchases A/B experiments. Automatically win back
              lapsed customers, reduce churn, get cancellation insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;
