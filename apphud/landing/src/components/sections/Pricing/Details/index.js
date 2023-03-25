import React, { useState } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const Details = ({ items }) => {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen(!open);

  return (
    <div className={cn(styles.details, { _open: open })}>
      <span onClick={handleToggle}>
        {open ? "Hide details" : "See details"}
      </span>
      <div>
        {items?.map((e, i) => (
          <p key={i} className={styles["detail-item"]}>
            {e.description}
            {e.soon && <span>soon</span>}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Details;
