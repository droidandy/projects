import React, {useCallback, useMemo, Fragment} from "react";
import styles from "./styles.module.scss";
import Select from "./Select";
import {track} from "../../../../../libs/helpers";

export default function SegmentByField({ data, filter, type, onSetFilters, andBy = false }) {
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
    const filtredSegmentsOptions = useCallback(
        (id, notNone) => {
            if (id) {
                return segmentsOptions
                    ?.filter((e) => {
                        if (e.label === "Time") {
                            const options = e.options.map((el) => el.value).flat();
                            return !options?.includes(id);
                        }

                        return true;
                    })
                    .map((e, i, arr) => {
                        const options = e.options;
                        const filtredOptions = options?.filter(
                            (element) => element?.value !== id
                        );

                        return {
                            ...e,
                            options: filtredOptions
                        };
                    });
            }

            if (notNone) {
                return segmentsOptions.filter((e) => e?.label?.length);
            }

            return segmentsOptions;
        },
        [filter?.segments, segmentsOptions]
    );
    const parsedSerments = useCallback(
        (val) => {
            const options = segmentsOptions?.map((e) => e.options)?.flat(1);
            return (
                options?.find((e) => e.value === val) || { label: "None", value: null }
            );
        },
        [segmentsOptions, data, filter]
    );
    return <Fragment>
        <div className={styles.segment}>
            <label className="l-p__label">Segment by</label>
            <Select
                name="segment"
                isGroup
                options={filtredSegmentsOptions(
                    filter?.segments[1]?.id,
                    type === "column"
                )}
                getOptions
                autoFocus={false}
                clearable={false}
                value={parsedSerments(
                    filter?.segment?.id || filter?.segments[0]?.id
                )}
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
                <label className="l-p__label">...and by</label>
                <Select
                    name="segment"
                    isGroup
                    options={filtredSegmentsOptions(filter?.segments[0]?.id)}
                    getOptions
                    autoFocus={false}
                    clearable={false}
                    value={parsedSerments(filter?.segments[1]?.id)}
                    onChange={(segment) => {
                        const segments = [...filter?.segments];

                        segments[1] = {
                            id: segment.value
                        };
                        track("charts_second_segment_selected", segment);

                        return onSetFilters("segments", segments);
                    }}
                />
            </div>
        }
    </Fragment>
}
