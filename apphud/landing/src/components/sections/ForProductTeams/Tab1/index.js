import React from "react";
import styles from "./styles.module.scss";
import {AnimationSubscribers} from "../../../Animation";

const Tab1 = () => {
  return (
    <>
      <div className={styles.content}>
        <label className="subheader-medium h4">Win back lapsed subscribers</label>
        <p className="text text_xl">
          Create rules to win back lapsed customers by offering them a discount.
          Connect OneSignal and launch automatic email campaigns to reduce
          churn.
        </p>
        <a href="/product" className="link">
          Learn about Apphud for product
        </a>
      </div>

      <div>
        <AnimationSubscribers />
      </div>
    </>
  );
};

export default Tab1;
