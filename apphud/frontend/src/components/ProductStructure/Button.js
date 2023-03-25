import React from "react";
import styles from "./index.module.scss"

export default function Button({ label, color = "blue", ...rest }) {
    return <button className={`${styles.button} ${color && styles[color]}`} {...rest}>{label}</button>
}
