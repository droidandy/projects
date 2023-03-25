import React from "react";
import styles from "./styles.module.scss";
import {AnimationMetrics} from "../../../Animation";

const Tab2 = () => {
  return (
    <>
      <div>
        <AnimationMetrics />
      </div>
      {/* <div className={styles.charts}>
        <div
          style={{ backgroundImage: `url(${require('../images/ball.svg')})` }}
          className={styles.bg}
        />
        <div className={styles.item}>
          <h4>Active Subscriptions</h4>
          <strong>1,836</strong>
          <img src={require('../images/chart-line.svg')} />
          <hr />
          <div className={styles.dates}>
            <span>May</span>

            <span>Jun</span>

            <span>Jul</span>

            <span>Aug</span>

            <span>Sep</span>
            <span>Oct</span>
          </div>
        </div>
      </div> */}

      <div className={styles.content}>
        <label className="subheader-medium h4">Dive into revenue metrics</label>
        <p className="text text_xl">
          Analyze MRR, churn and conversions to make data-driven decisions. Find
          out how many users start trials, convert to paying customers and
          renew.
        </p>
        <a href="/marketing" className="link">
          Learn about Apphud for marketing
        </a>
      </div>
    </>
  );
};

export default Tab2;
