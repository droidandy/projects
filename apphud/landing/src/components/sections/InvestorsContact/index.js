import React from "react";
import Link from "next/link";
import styles from "./styles.module.scss";
import Button from "components/UI/Button";

const InvestorsContact = () => {
  return (
    <div className={styles.more}>
      <div className="container container_sm">
        <div className={styles.wrap}>
          <img src={require("./icons/ic1.svg")} />
          <img src={require("./icons/ic2.svg")} />
          <img src={require("./icons/ic3.svg")} />
          <img src={require("./icons/ic4.svg")} />
          <h2>We are open for a partnership </h2>
          <div>
            <a href="/contact">
              <Button title={"Contact us"} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorsContact;
