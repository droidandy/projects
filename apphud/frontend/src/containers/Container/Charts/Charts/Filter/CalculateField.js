import React, {Fragment} from "react";
import styles from "./styles.module.scss";
import Select from "./Select";

export default function CalculateField({ list = [], chartId, value, onChange, title }) {
    const items = list
        .map((e) => e?.charts)
        .flat()
        .find((e) => e?.id === chartId)?.calc_methods
    ;
    const options = items?.map((e) => ({ value: e.id, label: e.name }))
    const selectedValue = options?.find((e) => e?.value === value) || options[0];
    return <Fragment>
        { options
            && <div className={styles.segment}>
                <label className="l-p__label">{title}</label>
                <Select
                    name="segment"
                    options={options}
                    isSearchable={false}
                    autoFocus={false}
                    clearable={false}
                    value={selectedValue}
                    onChange={(element) => {
                        onChange(element.value);
                    }}
                />
            </div>
        }
    </Fragment>
}
