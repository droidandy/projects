import React from "react";
import styles from "./styles.module.scss";

const Tab1 = () => {
  return (
    <>
      <div>
        <img src={require("../images/img1.svg")} alt="Send subscription events to integrations" />
      </div>

      <div className={styles.content}>
        <label className="subheader-medium h4">
          Send subscription <br />
          events to integrations
        </label>
        <p className="text text_xl">
          Apphud provides ready-to-use infrastructure for all kinds of in-app
          purchases. Integrate Apphud SDK and implement 2 lines of code.
        </p>
        <a href="/marketing" className="link">
          Learn about Apphud for marketing
        </a>
      </div>
    </>
  );
};

export default Tab1;
