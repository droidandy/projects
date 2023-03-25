import React from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

const More = ({ title, text }) => {
  return (
    <div className={styles.more}>
      <div className="container container_sm">
        <div className={styles.wrap}>
          <img src={require("./icons/ic1.svg")} />
          <img src={require("./icons/ic2.svg")} />
          <img src={require("./icons/ic3.svg")} />
          <img src={require("./icons/ic4.svg")} />
          <label className="h2">{title}</label>
          <div>
            <p>{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;
