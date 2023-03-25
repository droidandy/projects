import React from "react";
import styles from "./index.module.scss";

export default function QuarterLabel({ quarter, label }) {
    return <div className={styles.quarter}>
        <div className={styles.label}>
            Q{quarter}&nbsp;
            <span>{label}</span>
        </div>
    </div>
}
