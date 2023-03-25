import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import equal from "deep-equal";
import moment from "moment";
import styles from "./styles.module.scss";
import List from "./List";
import Tip from "../../../Common/Tip";
import { generatePeriod, getDateFromURI, setDateToURI, track } from "../../../../libs/helpers";
import DateRangePicker from "../../../Common/DateRangePicker";
import Filter from "./Filter";
import Chart from "./Chart";
import {connect} from "react-redux";
import ChartInfo from "./ChartInfo";

const initialState = {
  segment: null,
  filters: [],
  segments: [{ id: "time_day" }],
  time_range: { step: 86400 },
  calc_method: ""
};

const limit = 10;

const calculateUsing = ["arpu", "arppu"];

const ChartContainer = (props) => {
  const {settings: {timezone}, list } = props;
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(initialState);
  const [countSegments, setCountSemgents] = useState(0);
  const [loadMore, setLoadMore] = useState(true);
  const [conversion, setConversion] = useState({
    value: "% of total",
    label: "% of total"
  });
  const [pagination, setPagination] = useState({
    offset: 0,
    limit,
    count: 5
  });

  const period = getDateFromURI("charts");
  const [range, setRange] = useState({
    from: period.start_time,
    to: period.end_time
  });

  const onSetFilters = (key, val) => {
    setFilter({ ...filter, [key]: val });
    track("charts_filter_selected", { [key]:val });
  };

  const currentId = useMemo(() => {
    const locations = location?.pathname.split("/");
    return locations[locations.length - 1];
  }, [location]);

  const current = useMemo(() => {
    const charts = list?.map((e) => e.charts).flat(1);
    const chart = charts?.find((e) => e.id === currentId);
    if (chart?.calc_methods) {
      setFilter({
        ...initialState,
        calc_method: chart.calc_methods[0].id
      })
    }
    if (chart) {
      document.title = `Charts – ${chart?.name}`;
    }
    return chart;
  }, [list, currentId]);

  const onChangeHandler = useCallback(
    (e) => {
      const newRange = {
        from: moment(e.startDate).format("YYYY-MM-DD HH:mm:ss"),
        to: moment(e.endDate).format("YYYY-MM-DD HH:mm:ss")
      };
      setDateToURI(e.startDate, e.endDate, "charts");
      track("charts_date_range_changed", newRange);
      const diff = moment(e.endDate).diff(moment(e.startDate), "months", true);
      if (diff >= 0.99 && diff <= 2.99) {
        onSetFilters("time_range", {step: 604800})
      } else if (diff > 2.99) {
        onSetFilters("time_range", {step: 2592000})
      }

      if (!equal(range, newRange)) {
        setRange(newRange);
        setPagination({
          offset: 0,
          limit,
          count: 5,
          step: 0
        });
        setLoadMore(true);
        setConversion({
          value: "% of total",
          label: "% of total"
        });
      }


    },
    [setRange, range, onSetFilters]
  );

  useEffect(() => {
    setFilter({ ...initialState });
  }, []);

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
                  startTime={range.from}
                  endTime={range.to}
                  handleChangePeriod={onChangeHandler}
                />
              </div>

              {current?.type === "column" && (
                <div className={styles.badge}>
                  This report is based on cohorts depending on user creation
                  date.
                </div>
              )}
            </div>

            <Filter
              chartId={currentId}
              type={current?.type}
              onSetFilters={onSetFilters}
              filter={filter}
              setCountSemgents={setCountSemgents}
              list={list}
              setConversion={setConversion}
              conversion={conversion}
              refunds={filter?.refunds || false}
            />

            <Chart
              currentChart={currentId}
              type={current?.type}
              range={range}
              filter={filter}
              pagination={pagination}
              setPagination={setPagination}
              setLoadMore={setLoadMore}
              loadMore={loadMore}
              countSegments={countSegments}
              conversion={conversion}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer);
