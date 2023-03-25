import React, { useCallback, useMemo, useEffect, useRef, useState } from "react";
import cn from "classnames";
import { Bar, Line } from "react-chartjs-2";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import ChartDataConverions from "../transformers/ChartDataConverions";
import options, { getConversionOptions } from "./options";
import useChart from "./useChart";
import Table from "../Tables";
import ColumTable from "../Tables/TableBar";
import TableConversions from "../Tables/TableConversions";
import styles from "./styles.module.scss";
import { isConversions, countries } from "../settings";
import ExportCSV from "components/modals/ExportCSV/ExportCSV";
import ExportCSVSuccessModal from "components/modals/ExportCSVSuccess/ExportCSVSuccess";
import { useLocation } from "react-router";
import { getParamsForChartsRequest } from "./utils";
import DatasetsFilter from "../DatasetsFilter/DatasetsFilter";
import {track} from "../../../../../libs/helpers";

const filterData = (chartData) => {
  const datasets = chartData?.datasets?.filter(({ disabled }) => !disabled);
  return { ...chartData, datasets };
};

const noData = {
  label: "No Enough Data",
  text: "No sufficient data to display chart. Select a different date\n" +
    "        range, segment or filter."
}

const Alert = ({label, text}) => {
  return (
    <div className="chart-container__data-not-found">
      <h1>{label}</h1>
      <p>{text}</p>
    </div>
  );
};

const Chart = ({
  type,
  filter,
  range,
  currentChart,
  pagination,
  setLoadMore,
  loadMore,
  conversion,
  timezone,
  onPaginate
}) => {
  const {
    error,
    loading,
    data,
    setData,
    onDisabledColumns,
    disabledColumns,
    step,
    setStep
  } = useChart({
    type,
    filter,
    range,
    currentChart,
    pagination,
    setLoadMore,
    loadMore,
    conversion,
    timezone
  });

  const location = useLocation();

  const [ExportCSVModalIsOpen, setExportCSVModalIsOpen] = useState(false);
  const [ExportCSVSuccessModalIsOpen, setExportCSVSuccessModalIsOpen] = useState(false);

  const appId = location.pathname.split("/")[2];
  const paramsForExportCSVRequest = getParamsForChartsRequest({appId, range, currentChart, filter, timezone, type, pagination})

  const [filteredData, setFilteredData] = useState({});

  useEffect(() => {
    if (data?.datasets && filteredData?.datasets) {
      setFilteredData({
        ...data,
        datasets: data?.datasets?.filter((el) => {
          return filteredData?.datasets?.find((_el) => _el?.label === el?.label) !== undefined;
        })
      })
    }else {
      setFilteredData(data);
    }
  }, [data]);

  const barRef = useRef(null);

  const onDisabled = (label) => {
    const newData = {
      ...data,
      datasets: data.datasets.map((el) => {
        if (el?.label === label) {
          return {
            ...el,
            disabled: !el.disabled
          }
        }
        return el;
      })
    };
    setData(newData);
  };

  const onAllSelector = (value = null) => {
    const newData = { ...data };
    for (let i=0; i<newData.datasets.length; i++) {
      newData.datasets[i].disabled = value !== null ? !value : !newData?.datasets[i].disabled;
    }
    setData(newData);
  };

  const isChartTypeWithoutOverall = () => {
    const chartTypes = ["mrr", "ltv", "churn_subscriptions", "churn_revenue"];

    return chartTypes.includes(currentChart);
  }

  const isOverallWithoutPrefix = () => {
    const chartTypes = [
      "new_users",
      "trial_subs_events",
      "other_events",
      "promo_offers_events",
      "paid_intro_offers_events",
      "regular_subs_events",
      "cancel_subs_events"
    ]

    return chartTypes.includes(currentChart);
  }

  const paginationData = useMemo(() => {
    const indexOfLast = (step + 1) * (pagination.limit / 2);
    const indexOfFirst = indexOfLast - pagination.limit / 2;
    const filtredElements = data?.rows?.slice(indexOfFirst, indexOfLast);

    const labels = filtredElements?.map((row) =>
      row.segments.map((el) => countries[el.value] || el.value).join(" | ")
    );

    if (isConversions.includes(currentChart)) {
      return {
        ...data,
        datasets: ChartDataConverions.getDatasets(filtredElements, conversion),
        labels
      };
    }

    return {
      ...data,
      datasets: [
        {
          label: "#",
          data: filtredElements?.map((row) => row?.values[0]?.value),
          borderColor: "#0085ff",
          backgroundColor: "#0085ff"
        }
      ],
      labels
    };
  }, [data, pagination, disabledColumns, step, conversion]);

  const segmentsCount = useMemo(() => {
    const total = paginationData?.rows?.length;
    const indexOfLast = (step + 1) * (pagination.limit / 2);
    const indexOfFirst = indexOfLast - pagination.limit / 2;

    return {
      max: Math.ceil(total / (pagination.limit / 2)),
      current: Math.ceil(total / (pagination.limit / 2)),
      start: indexOfFirst,
      end: indexOfLast > total ? total : indexOfLast,
      total
    };
  }, [data, pagination, disabledColumns, paginationData, step]);

  const renderTable = useCallback(() => {
    if (isConversions.includes(currentChart)) {
      return (
        <div className={styles["pagination-table"]}>
          <TableConversions
            data={filteredData?.data}
            conversion={conversion}
            steps={{
              start: segmentsCount?.start,
              end: segmentsCount?.end
            }}
          />

          {!!filteredData?.data?.length && loadMore && (
            <div className={styles["btns-pagination"]}>
              <button
                type="button"
                onClick={(e) => {
                  onPaginate(e);
                  track("charts_load_more_clicked")
                }}
              >
                {loading ? "Loading..." : "Load more rows"}
              </button>
            </div>
          )}
        </div>
      );
    }

    if (type === "column") {
      const toFixedValue = currentChart === "arppu" || currentChart === "arpu" ? 2 : 1;
      return (
        <div className={styles["pagination-table"]}>
          <ColumTable
            data={filteredData?.data}
            onDisabled={onDisabledColumns}
            disabledColumns={disabledColumns}
            toFixedValue={toFixedValue}
          />
          {!!filteredData?.data?.length && loadMore && (
            <div className={styles["btns-pagination"]}>
              <button
                type="button"
                onClick={(e) => {
                  onPaginate(e);
                  track("charts_load_more_clicked")
                }}
              >
                {loading ? "Loading..." : "Load more rows"}
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Table
        withoutOverallSum={isChartTypeWithoutOverall()}
        isOverallWithoutPrefix={isOverallWithoutPrefix()}
        data={filteredData}
        onDisabled={onDisabled}
        onAllSelector={onAllSelector}
        segment={filter?.segment?.name}
        chartId={currentChart}
      />
    );
  }, [filteredData, type, onDisabled, loadMore, conversion, segmentsCount]);

  const rowsToExport = type === "column" ? data?.data?.length : data?.datasets?.length * data?.labels?.length;
  return (
    <div className={cn("chart-container_custom", styles.chart)}>
      <div className={styles["chart-container"]}>
        {(data?.rows?.length === 0 || data?.lines?.length === 0 || error) && !loading && <Alert {...(error || noData)} />}

        {type === "line" && data && (
          <Line data={filterData(data)} options={options(data)} />
        )}

        {type === "column" && paginationData && (
          <>
            <div className={styles.pagination}>
              <span>
                Showing{" "}
                {segmentsCount.total === 0 ? 0 : segmentsCount.start + 1} -{" "}
                {segmentsCount.end} segments of {segmentsCount.total}
              </span>
              <button
                type="button"
                className={cn({
                  _active: segmentsCount.start > 0
                })}
                onClick={() => {
                  if (segmentsCount.start > 0) {
                    setStep(step - 1);
                  }
                }}
              >
                <MdKeyboardArrowLeft size={24} />
              </button>
              <button
                type="button"
                className={cn({
                  _active: segmentsCount.end < segmentsCount.total
                })}
                onClick={() => {
                  if (segmentsCount.end < segmentsCount.total) {
                    setStep(step + 1);
                  }
                }}
              >
                <MdKeyboardArrowRight size={24} />
              </button>
            </div>
            {!loading && (
              <Bar
                data={paginationData}
                options={getConversionOptions(
                  conversion.value,
                  isConversions.includes(currentChart),
                  barRef?.current?.chartInstance.update()
                )}
                redraw
                ref={barRef}
              />
            )}
          </>
        )}
      </div>

      {loading && (
        <div className="chart__preloader">
          <div className="chart__preloader-spin">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.0"
              width="32px"
              height="32px"
              viewBox="0 0 128 128"
              xmlSpace="preserve"
            >
              <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
              <g>
                <path
                  d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z"
                  fill="#0084ff"
                  fillOpacity="1"
                />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 64 64"
                  to="360 64 64"
                  dur="1400ms"
                  repeatCount="indefinite"
                />
              </g>
            </svg>
          </div>
        </div>
      )}
      <div className={styles.filterContainer}>
        <div className={styles.item}>
          { data && data?.segments?.length && type === "line"
            && <DatasetsFilter data={data} onFilter={(d) => setFilteredData(d)} />
          }
        </div>
        <div>
          <div className="chart-exportcsv-button" onClick={() => {
            setExportCSVModalIsOpen(true);
            track("charts_export_link_clicked");
          }}>
            <svg
                className="va-middle"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 6.78V8.97L16 5.23L12 1.5V3.63C8.11 4.17 6.56 6.83 6 9.5C7.39 7.63 9.22 6.78 12 6.78ZM3 3.5C1.89543 3.5 1 4.39543 1 5.5V13.5C1 14.6046 1.89543 15.5 3 15.5H13C14.1046 15.5 15 14.6046 15 13.5V10.5H13V13.5H3L3 5.5H6V3.5H3Z"
                  fill="#0085FF"
              />
            </svg>
            <span className="va-middle ml4">Export CSV</span>
          </div>
        </div>
      </div>

      <ExportCSV
        rowsToExport={rowsToExport}
        chartType={type}
        paramsForRequest={paramsForExportCSVRequest}
        onClose={() => setExportCSVModalIsOpen(false)}
        onExport={() => {
          setExportCSVSuccessModalIsOpen(true)
          track("charts_export_submitted");
        }}
        isOpen={ExportCSVModalIsOpen}
      />
      <ExportCSVSuccessModal onClose={() => setExportCSVSuccessModalIsOpen(false)} isOpen={ExportCSVSuccessModalIsOpen} />
      { data && renderTable()}
    </div >
  );
};

export default Chart;
