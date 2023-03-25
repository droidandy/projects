import React, { useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Tip from "../../../Common/Tip";
import DateRangePicker from "../../../Common/DateRangePicker";
import Chart from "./Chart";
import {connect} from "react-redux";
import ChartInfo from "../Charts/ChartInfo";
import Filter from "../Charts/Filter";
import styles from "../Charts/styles.module.scss";
import { usePeriod, useFilter } from "../hooks";
import {track} from "../../../../libs/helpers";

const limit = 10;

const LineChartContainer = (props) => {
  const {settings: {timezone}, list, chart } = props;
  const {period, onSetPeriod, isEqualPeriod} = usePeriod("charts");
  const {filter, onSetFilter} = useFilter(`charts.${chart.storageKey}`);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [countSegments, setCountSemgents] = useState(0);
  const [loadMore, setLoadMore] = useState(true);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit,
    count: 5
  });

  const currentId = useMemo(() => {
    const locations = location?.pathname.split("/");
    return locations[locations.length - 1];
  }, [location]);

  const current = useMemo(() => {
    const charts = list?.map((e) => e.charts).flat(1);
    const chart = charts?.find((e) => e.id === currentId);
    if (chart?.calc_methods) {
      onSetFilter("calc_method", filter?.calc_method?.length > 0 ? filter?.calc_method : chart.calc_methods[0].id);
    }
    if (chart) {
      document.title = `Charts – ${chart?.name}`;
    }
    return chart;
  }, [list, currentId]);

  const onSetFilters = (key, val) => {
    onSetFilter(key, val);
    setPagination({
      offset: 0,
      limit
    });
  };
  const onChangeHandler = useCallback(
    (e) => {
      if (!isEqualPeriod(e)) {
        onSetPeriod(e);
        setPagination({
          offset: 0,
          limit,
          count: 5,
          step: 0
        });
        setLoadMore(true);
        onSetFilter("conversion", {
          value: "% of total",
          label: "% of total"
        });
      }

    },
    []
  );

  return (
    <>
      {!loading && currentId && list.length > 0 && (
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
            </div>

            <Filter
              chartId={currentId}
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
              currentChart={currentId}
              type={current?.type}
              range={period}
              filter={filter}
              pagination={pagination}
              setPagination={setPagination}
              setLoadMore={setLoadMore}
              loadMore={loadMore}
              countSegments={countSegments}
              conversion={filter?.conversion}
              timezone={timezone}
              onPaginate={() => {
                track("charts_load_more_clicked")
                setPagination({
                  ...pagination,
                  offset: pagination.offset + limit
                })
              }}
            />
          </div>
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(LineChartContainer);
