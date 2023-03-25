import React from "react";
import styles from "./styles.module.scss";

const Tab3 = () => {
  return (
    <>
      <div>
        <img src={require("../images/img3.svg")} alt="Receive notifications about transactions" />
      </div>

      <div className={styles.content}>
        <label className="subheader-medium h4">
          Receive notifications <br />
          about transactions
        </label>
        <p className="text text_xl">
          Integrate Slack or Telegram and receive a notification when a user
          starts new trial, gets billed or cancels a subscription.
        </p>
        <a href="/marketing" className="link">
          Learn about Apphud for marketing
        </a>
      </div>
    </>
  );
};

export default Tab3;
