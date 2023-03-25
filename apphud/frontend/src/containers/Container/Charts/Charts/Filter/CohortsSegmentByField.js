import React, {useMemo, Fragment} from "react";
import styles from "./styles.module.scss";
import Select from "./Select";
import {track} from "../../../../../libs/helpers";

export default function CohortsSegmentByField({ data, filter, type, onSetFilters, andBy = false }) {
    const segmentsOptions = useMemo(() => {
        const defaultOptions = {
            label: "",
            options: [{ label: "None", value: null }]
        };
        const groupOptions = data?.segment_groups?.map((e) => {
            const options = e?.segments?.map((el) => ({
                label: el.name,
                value: el.id
            }));

            return {
                label: e.name,
                options
            };
        });
        return groupOptions ? [defaultOptions, ...groupOptions] : [];
    }, [data]);
    const segmentByOptions = segmentsOptions.filter((e) => e.label !== "Time");
    const getValueFromList = (val, options) => {
        return options?.find((e) => e.value === val)
    }
    const viewByOptions = [
        {
            value: "time_week",
            label: "Week"
        },
        {
            value: "time_month",
            label: "Month"
        },
        {
            value: "time_quarter",
            label: "Quarter"
        },
        {
            value: "time_year",
            label: "Year"
        }
    ];
    const segmentValue = getValueFromList(filter?.segments[0]?.id, segmentByOptions?.map((e) => e.options)?.flat(1));
    return <Fragment>
        <div className={styles.segment}>
            <label className="l-p__label">Segment by</label>
            <Select
                name="segment"
                isGroup
                options={segmentByOptions}
                getOptions
                autoFocus={false}
                clearable={false}
                value={segmentValue}
                onChange={(segment) => {
                    track("charts_segment_selected", segment);
                    if (type === "column") {
                        const segments = [...filter?.segments];
                        segments[0] = {
                            id: segment.value
                        };
                        return onSetFilters("segments", segments);
                    }
                    onSetFilters("segment", {
                        id: segment.value,
                        name: segment.label
                    });
                }}
            />
        </div>
        { andBy
            && <div className={styles.segment}>
                <label className="l-p__label">View by</label>
                <Select
                    name="segment"
                    isGroup
                    options={viewByOptions}
                    getOptions
                    autoFocus={false}
                    clearable={false}
                    value={getValueFromList(filter?.segments[1]?.id, viewByOptions)}
                    onChange={(segment) => {
                        const segments = [...filter?.segments];
                        segments[1] = {
                            id: segment.value
                        };
                        return onSetFilters("segments", segments);
                    }}
                />
            </div>
        }
    </Fragment>
}
