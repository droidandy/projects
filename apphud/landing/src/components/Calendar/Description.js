import React from "react";
import styles from "./index.module.scss";

export default function Description() {
    return <div className={styles.description}>
        <label className={styles.subLabel}>Be aware of when you’ll get paid for the App Store earnings</label>
        <br/>
        <p>Apple App Store payment cycles are confusing to even experienced developers and companies.</p>
        <br/>
        <span className={styles.filled}>
            This tool is for reference only, exact payment dates may vary!
        </span>
        <br/><br/>
        <p>
            Apple’s fiscal year consists of Q1, Q2, Q3, and Q4 quarters, each with one 35-day month and two 28-day months. The fiscal year starts in October, so Apple’s fiscal 2021 started with Q1 in October 2020. Sounds weird, right?
            <br/><br/>
            Apple usually pays 33 days after the end of each fiscal month (with rare exceptions). So roughly speaking, it’s 4 weeks + 5 days.
        </p>
        <br/><br/><br/><br/>
        <label className={styles.label}>
            2021 Apple Payment Dates
        </label>
        <br/>
        <p className={styles.center}>
            Estimated payment dates in blue. Hover or tap to reveal its sales dates.
        </p>
        <br/><br/>
    </div>
}
