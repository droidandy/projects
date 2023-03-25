import React, { useMemo, useEffect, useRef, useState } from "react";
import cn from "classnames";
import { Bar } from "react-chartjs-2";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import ChartDataConverions from "../../Charts/transformers/ChartDataConverions";
import { getConversionOptions } from "./options";
import TableConversions from "../../Charts/Tables/TableConversions";
import styles from "./styles.module.scss";
import ExportCSV from "components/modals/ExportCSV/ExportCSV";
import ExportCSVSuccessModal from "components/modals/ExportCSVSuccess/ExportCSVSuccess";
import { useLocation } from "react-router";
import { getParamsForChartsRequest } from "./utils";
import {countries, isConversions} from "../../Charts/settings";
import useChart from "../useChart";
import {track} from "../../../../../libs/helpers";

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
    loading,
    data,
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
  const paginationData = useMemo(() => {
    const indexOfLast = (step + 1) * (pagination.limit / 2);
    const indexOfFirst = indexOfLast - pagination.limit / 2;
    const filtredElements = data?.rows?.slice(indexOfFirst, indexOfLast);
    const labels = filtredElements?.map((row) =>
      row.segments.map((el) => countries[el.value] || el.value).join(" | ")
    );
    return {
      ...data,
      datasets: ChartDataConverions.getDatasets(filtredElements, conversion),
      labels
    };
  }, [data, pagination,  step, conversion]);
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
  }, [data, pagination,  paginationData, step]);
  const rowsToExport = data?.data?.length;

  return (
    <div className={cn("chart-container_custom", styles.chart)}>
      <div className={styles["chart-container"]}>
        {(data?.rows?.length === 0 || data?.lines?.length === 0) && !loading && (
          <div className="chart-container__data-not-found">
            <h1>No Enough Data</h1>
            <p>
              No sufficient data to display chart. Select a different date
              range, segment or filter.
            </p>
          </div>
        )}
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
        onExport={() => setExportCSVSuccessModalIsOpen(true)}
        isOpen={ExportCSVModalIsOpen}
      />
      <ExportCSVSuccessModal onClose={() => setExportCSVSuccessModalIsOpen(false)} isOpen={ExportCSVSuccessModalIsOpen} />
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
            <button type="button" onClick={onPaginate}>
              {loading ? "Loading..." : "Load more rows"}
            </button>
          </div>
        )}
      </div>
    </div >
  );
};

export default Chart;
