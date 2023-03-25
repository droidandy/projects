import React from "react";
import styles from "./styles.module.scss";
import Switch from "../../../../../components/Switch";

export default function ExcludeRefunds({ value, onChange }) {
    return <div className={styles.segment}>
        <label>&nbsp;</label>
        <div className={styles.switcher}>
            <Switch title="Exclude Refunds" checked={value} onChange={(e) => {
                onChange(e.target.checked)
            }} />
        </div>
    </div>
}
