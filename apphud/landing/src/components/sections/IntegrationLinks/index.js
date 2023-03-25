import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const IntegrationLinks = ({ text, links, alignLeft }) => {
  return (
    <div className={cn(styles.links, { alignLeft })}>
      <div className={styles.list}>{links}</div>
      <p className={cn(styles.text, "text_xl")}>{text}</p>
    </div>
  );
};

export default IntegrationLinks;
