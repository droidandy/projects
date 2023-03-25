import React, {
  useEffect,
  useState,
  useMemo,
  Fragment
} from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";
import axios from "axios";
import AddFilterModal from "./AddFilterModal";
import styles from "./styles.module.scss";
import { countries } from "../settings";
import CalculateField from "./CalculateField";
import ViewByField from "./ViewByField";
import SegmentByField from "./SegmentByField";
import ViewAsField from "./ViewAsField";
import ExcludeRefunds from "./ExcludeRefunds";
import CohortsSegmentByField from "./CohortsSegmentByField";
import {track} from "../../../../../libs/helpers";

const mapper = {
  equals: "equals",
  not_equals: "does not equal",
  contains: "contains",
  not_contains: "does not contain",
};

const Filter = ({
  chartId,
  type,
  onSetFilters,
  filter,
  setCountSemgents,
  list,
  setConversion,
  conversion,
  refunds
}) => {
  const [data, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const appId = location.pathname.split("/")[2];

  const getOptions = async() => {
    try {
      const { data } = await axios.get(
        `/api/v1/chart/options?app=${appId}&chart=${chartId}`
      );

      setData(data);
      setCountSemgents(
        data?.segment_groups?.map((e) => e.segments).flat(1)?.length
      );
    } catch (err) {
      // to do
    }
  };

  useEffect(() => {
    if (chartId) {
      getOptions();
    }
  }, [chartId]);

  const filterOptions = useMemo(() => {
    return data?.filter_groups?.map((e) => {
      const options = e?.filters.map((el) => ({
        label: countries[el.name] || el.name,
        value: el.id,
        values: el.values,
        conditions: (el.conditions || []).map(cond => ({label: mapper[cond] || cond, value: cond})),
      }));

      return {
        label: e.name,
        options
      };
    });
  }, [data]);

  const onRemove = (id) => {
    const removedFiltres = filter.filters.filter((e) => e.id !== id);
    onSetFilters("filters", removedFiltres);
  };


  const renderForm = (id, type) => {
    switch (id) {
      case "trial_subs_events":
      case "regular_subs_events":
      case "cancel_subs_events":
      case "paid_intro_offers_events":
      case "promo_offers_events":
      case "other_events":
      case "non_renewing_purchases":
        return <Fragment>
          <CalculateField
            value={filter?.calc_method}
            list={list}
            title={"Event"}
            chartId={chartId}
            onChange={(v) => {
              onSetFilters("calc_method", v);
            }}
          />
          <SegmentByField
            type={type}
            data={data}
            filter={filter}
            onSetFilters={onSetFilters}
          />
          <ViewByField
            value={filter?.time_range?.step}
            onChange={(step) => {
              onSetFilters("time_range", { step });
            }}
          />
        </Fragment>
      case "trial_conversions":
      case "paid_intro_conversions":
      case "regular_conversions":
      case "non_renewing_conversions":
      case "promo_conversions":
        return <Fragment>
          <SegmentByField
            type={type}
            data={data}
            filter={filter}
            onSetFilters={onSetFilters}
            andBy={true}
          />
          <ViewAsField
            onChange={(element) => {setConversion(element)}}
            value={conversion}
          />
          <ExcludeRefunds
            value={filter?.calc_method === "without_refunds"}
            onChange={(v) => {
              track("charts_conversions_exclude_refunds_changed", { value: v ? "on":"off"});
              onSetFilters("calc_method", v ? "without_refunds" : "");
            }}
          />
        </Fragment>
      case "arpu":
      case "arppu":
        return <Fragment>
          <SegmentByField
              type={type}
              data={data}
              filter={filter}
              onSetFilters={onSetFilters}
              andBy={true}
          />
          <CalculateField
              value={filter?.calc_method}
              list={list}
              title={"Calculate using"}
              chartId={chartId}
              onChange={(v) => {
                track("charts_calculate_using_switched", {value:v});
                onSetFilters("calc_method", v);
              }}
          />
        </Fragment>
      case "subscribers_retention":
      case "revenue_retention":
        return <Fragment>
          <CohortsSegmentByField
              type={type}
              data={data}
              filter={filter}
              onSetFilters={onSetFilters}
              andBy={true}
          />
        </Fragment>
      default:
        return <Fragment>
          <SegmentByField
              type={type}
              data={data}
              filter={filter}
              onSetFilters={onSetFilters}
              andBy={type === "column"}
          />
          <ViewByField
              value={filter?.time_range?.step}
              onChange={(step) => {
                onSetFilters("time_range", { step });
              }}
          />
        </Fragment>
    }
  }

  return (
    <div className={cn(styles.filter)}>
      <div className={styles.segments}>
        {renderForm(chartId, type)}
      </div>
      <div className="charts-filters__custom">
        <div
          className="cf__c-tag cf__c-tag_add"
          onClick={() => setIsOpen(true)}>
          <svg
            className="va-middle"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 4H7V7H4V9H7V12H9V9H12V7H9V4Z"
              fill="white"
            />
          </svg>
          <span className="va-middle">Where</span>
        </div>
        {filter?.filters?.map((filter, index, arr) => {
          console.log('filter', filter);
          return (
            <Fragment key={index}>
              <div className="cf__c-tag cp">
                <svg
                  onClick={() => onRemove(filter.id)}
                  className="va-middle cp"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.9497 3.05025C15.6834 5.78392 15.6834 10.2161 12.9497 12.9497C10.2161 15.6834 5.78391 15.6834 3.05024 12.9497C0.316572 10.2161 0.316572 5.78392 3.05024 3.05025C5.78391 0.316582 10.2161 0.316583 12.9497 3.05025ZM7.99999 6.58579L10.1213 4.46447L11.5355 5.87868L9.4142 8L11.5355 10.1213L10.1213 11.5355L7.99999 9.41421L5.87867 11.5355L4.46446 10.1213L6.58578 8L4.46446 5.87868L5.87867 4.46447L7.99999 6.58579Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="va-middle">
                {filter.name} ={" "}
                  {filter.values.map(
                    (equalItem, index) =>
                      (countries[equalItem?.value] || equalItem?.value) +
                      (filter.values.length - 1 === index ? "" : " Or ")
                  )}
              </span>
              </div>
              {index < arr.length - 1 && <span className="delimiter">And</span>}
            </Fragment>
          )
        })}
      </div>
      <AddFilterModal
        isOpen={isOpen}
        filterOptions={filterOptions}
        onClose={() => {
          setIsOpen(false);
        }}
        onSetFilters={onSetFilters}
        filter={filter}
      />
    </div>
  );
};

export default Filter;
