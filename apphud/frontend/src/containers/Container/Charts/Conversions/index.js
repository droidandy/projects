import React, { useState } from "react";
import moment from "moment";
import styles from "../Charts/styles.module.scss";
import Tip from "../../../Common/Tip";
import DateRangePicker from "../../../Common/DateRangePicker";
import {connect} from "react-redux";
import ChartInfo from "../Charts/ChartInfo";
import Filter from "../Charts/Filter";
import Chart from "./Chart";
import { usePeriod, useFilter } from "../hooks";
import {track} from "../../../../libs/helpers";

const limit = 10;

const ConversionsContainer = (props) => {
    const { settings: {timezone}, list } = props;
    const {period, onSetPeriod, isEqualPeriod} = usePeriod("charts");
    const diff = moment(period.to).diff(moment(period.from), "days");
    const current = props.chart;
    const {filter, onSetFilter} = useFilter(`charts.${current.storageKey}`);
    const [countSegments, setCountSemgents] = useState(0);
    const [loadMore, setLoadMore] = useState(true);
    const [pagination, setPagination] = useState({
        offset: 0,
        limit
    });
    const onSetFilters = (key, val) => {
        onSetFilter(key, val);
        setPagination({
            offset: 0,
            limit
        });
    };
    const onChangeHandler = (e) => {
      if(!isEqualPeriod(e)) {
        onSetPeriod(e);
        setLoadMore(true);
        onSetFilter("conversion", {
          value: "% of total",
          label: "% of total"
        });
        setPagination({
          offset: 0,
          limit
        });
      }
    };
    console.log('--->', diff, loadMore)
    return (
        <>
            <div className={styles["container-content"]}>
                <div className={styles.header}>
                    <div className={styles["header-title"]}>
                        <div>
                            <h2>{ChartInfo[current?.id]?.label || current?.name}</h2>
                            {(ChartInfo[current?.id]?.description || current?.description) && (
                                <Tip
                                    title={ChartInfo[current?.id]?.label || current?.name}
                                    description={ChartInfo[current?.id]?.description || current?.description}
                                    buttonUrl={ChartInfo[current?.id]?.url || `https://docs.apphud.com/analyze/charts#${current?.id}`}
                                />
                            )}
                        </div>
                        <DateRangePicker
                            anchorDirection="right"
                            startTime={period.from}
                            endTime={period.to}
                            handleChangePeriod={onChangeHandler}
                        />
                    </div>
                    <div className={styles.badge}>
                        This report is based on cohorts depending on user creation
                        date.
                    </div>
                </div>
                <Filter
                    chartId={current?.id}
                    type={current?.type}
                    onSetFilters={onSetFilters}
                    filter={filter}
                    setCountSemgents={setCountSemgents}
                    list={list}
                    setConversion={(v) => onSetFilter("conversion", v)}
                    conversion={filter?.conversion}
                    refunds={filter?.refunds || false}
                />
                <Chart
                    currentChart={current?.id}
                    type={current?.type}
                    range={period}
                    filter={filter}
                    pagination={pagination}
                    setLoadMore={setLoadMore}
                    loadMore={loadMore && diff > 8}
                    countSegments={countSegments}
                    conversion={filter?.conversion}
                    timezone={timezone}
                    onPaginate={() => {
                        track("charts_load_more_clicked");
                        setPagination({
                            ...pagination,
                            offset: pagination.offset + limit
                        })
                    }}
                />
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        settings: state.settings
    }
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ConversionsContainer);
