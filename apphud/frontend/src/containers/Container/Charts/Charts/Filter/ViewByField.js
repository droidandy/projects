import React from "react";
import styles from "./styles.module.scss";
import Select from "./Select";
import {resolutions} from "../settings";
import {track} from "../../../../../libs/helpers";

export default function ViewByField({ onChange, value }) {
    const options = resolutions;
    const selectedValue = options?.find((e) => e?.value === value)
    return <div className={styles.segment}>
        <label className="l-p__label">View by</label>
        <Select
            name="segment"
            options={options}
            isSearchable={false}
            autoFocus={false}
            clearable={false}
            value={selectedValue || false}
            onChange={(element) => {
                onChange(element.value);
                track("charts_view_by_changed", element);
            }}
        />
    </div>
}
