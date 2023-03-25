import React from "react";
import Button from "components/UI/Button";
import styles from "./styles.module.scss";

const GetStarted = () => {
  return (
    <div className="container">
      <div className={styles.started}>
        <div>
          <h2>Getting started is easy. Try Apphud today</h2>
          <p>
            Build better apps with Apphud. No credit card required. Free for
            startups.
          </p>
          <div className={styles.btns}>
            <a rel="nofollow" href="https://app.apphud.com/sign_up">
              <Button title="Start for Free" />
            </a>
            <Button title="Talk to us" transparent className="open-chat" />
          </div>
        </div>

        <div>
          <img src={require("./flag.svg")}  alt="Getting started is easy. Try Apphud today" />
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
