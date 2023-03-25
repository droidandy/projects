import React, { useState, useEffect } from "react";
import styles from "./DatasetsFilter.module.scss";
import Input from "../../../../../components/Input";
import {countries} from "../settings";
import {track} from "../../../../../libs/helpers";

export default function DatasetsFilter({ data, onFilter }) {
    const [value, setValue] = useState("");
    const onChangeHandler = (e) => {
        const val = e?.value?.toLowerCase();
        onFilter({
            ...data,
            datasets: data?.datasets?.filter((seg) => {
                const label = countries[seg?.label] || seg?.label;
                return label?.toLowerCase().indexOf(val) !== -1
            }),
            segments: data?.segments?.filter((seg) => {
                const name = countries[seg?.name] || seg?.name;
                return name?.toLowerCase().indexOf(val) !== -1
            })
        });
        setValue(val);
        track("charts_data_filtered", { query: val });
    }
    return <div className={styles.container}>
        <div className={styles.wrapper}>
            <Input placeholder="Search" value={value} onChange={onChangeHandler} />
        </div>
    </div>
}
