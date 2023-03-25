import React from "react";
import styles from "./Toggle.module.scss";


export default function Toggle({ checked, children, half = false, ...rest }) {
    return <div className={styles.container}>
        <div className={`${styles.root} ${checked ?  styles.checked : styles.default}`} {...rest}>
            <div className={checked ? (half ? styles.half : styles.checked) : styles.default} />
        </div>
        {children}
    </div>
}
