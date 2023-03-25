import React from "react";
import styles from "./styles.module.scss";
import Select from "./Select";
import {conversionsOptions} from "../settings";

export default function ViewAsField({ value, onChange }) {
    return <div className={styles.segment}>
        <label className="l-p__label">View as</label>
        <Select
            name="segment"
            options={conversionsOptions}
            isSearchable={false}
            autoFocus={false}
            clearable={false}
            value={value}
            onChange={onChange}
        />
    </div>
}
