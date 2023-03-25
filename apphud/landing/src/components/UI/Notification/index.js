import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const Notification = ({ text, show }) => {
  return <div className={cn(styles.notification, { show })}>{text}</div>;
};

export default Notification;
