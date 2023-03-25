import React from "react";
import styles from "./index.module.scss";

export default function PopoverMenuItem({ label, color = "none", ...rest }) {
    return <div className={`${styles.menuItem} ${styles[color]}`} {...rest}>
        {label}
    </div>
}
