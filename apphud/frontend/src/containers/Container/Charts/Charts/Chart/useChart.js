import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import equal from "deep-equal";
import ChartDataTransformer from "../transformers/ChartDataTransformer";
import ChartDataColumnTransformer from "../transformers/ChartDataColumnTransformer";
import ChartDataConverions from "../transformers/ChartDataConverions";
import colors from "../utils/colors";
import { isConversions } from "../settings";
import { getParamsForChartsRequest } from "./utils";

// Hook
function usePrevious(value) {
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const useChart = ({
  type,
  filter,
  range,
  currentChart,
  pagination,
  setLoadMore,
  conversion,
  timezone
}) => {
  const location = useLocation();
  const [disabledColumns, setDisabledColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setData] = useState({
    rows: [],
    lines: []
  });
  const [step, setStep] = useState(0);
  const prevProps = usePrevious({ type, range, filter, currentChart });

  const onReset = useCallback(() => {
    const deepEqual = equal(prevProps, { type, range, filter, currentChart });

    if (!deepEqual) {
      setData({
        rows: [],
        lines: []
      });
      setStep(0);

      setDisabledColumns([]);
    }
  }, [range, filter, type, prevProps]);

  useEffect(() => {
    setLoading(true);
    getChartLines();
  }, [filter, range, currentChart, type, pagination, timezone]);

  const getChartLines = useCallback(async() => {
    onReset();

    try {
      setError(null);
      const appId = location.pathname.split("/")[2];
      const params = getParamsForChartsRequest({appId, range, currentChart, filter, timezone, type, pagination})
      const { data } = await axios.post(`/api/v1/chart/query/${type}`, params);

      if (type === "column") {
        const deepEqual = equal(
          data?.rows,
          chartData?.rows?.slice(-data?.rows?.length)
        );

        if (data?.rows?.length === 0) {
          setLoadMore(false);
          setLoading(false);
          return;
        }

        if (data?.rows?.length < pagination.limit) {
          setLoadMore(false);
        } else {
          setLoadMore(!deepEqual);
        }

        setData((prevState) => {
          const newData = {
            rows: [...prevState.rows, ...data.rows].filter((v,i,a)=>a.findIndex(t=>(JSON.stringify(t) === JSON.stringify(v)))===i)
          };

          if (isConversions.includes(currentChart)) {
            return ChartDataConverions.transform(newData, conversion);
          }

          return ChartDataColumnTransformer.transform(newData, colors, []);
        });

      } else {
        setData(ChartDataTransformer.transform(data, colors, [], timezone));
      }
    } catch (err) {
      const {code} = err.response.data;
      if (code === "incorrect_input") {
        setError({
          label: "There was a problem with the request. Try to simplify filters and reduce the date range.",
          text: "Too broad data range to display the chart. Select a different date range, segment, or filter."
        })
      }
    } finally {
      setLoading(false);
    }
  }, [currentChart, range, filter, pagination, timezone]);

  const onDisabledColumns = (id, parent) => {
    let disabled;
    const parentSegment = chartData?.data[id]?.segments[0]?.value;
    const findIdsParentSegments = chartData?.data?.reduce(
      (acc, curr, index) => {
        if (curr?.segments[0]?.value === parentSegment) {
          return [...acc, index];
        }

        return acc;
      },
      []
    );

    if (disabledColumns.includes(id)) {
      if (parent) {
        disabled = disabledColumns.filter(
          (e) => !findIdsParentSegments.includes(e)
        );
      } else {
        disabled = disabledColumns.filter((e) => e !== id);
      }
    } else {
      if (parent) {
        disabled = [...disabledColumns, ...findIdsParentSegments];
      } else {
        disabled = [...disabledColumns, id];
      }
    }

    const filtred = chartData?.data?.filter((_, i) => !disabled.includes(i));

    const filtredData = {
      ...chartData,
      labels: ChartDataColumnTransformer.getLabels(filtred),
      rows: filtred,
      datasets: [
        {
          label: "#",
          data: filtred?.map((row) => row?.values[0]?.value),
          borderColor: "#0085ff",
          backgroundColor: "#0085ff"
        }
      ],
      segments: ChartDataColumnTransformer.getSegments(filtred),
      segmentName: "Day"
    };

    setDisabledColumns(disabled);
    setData(filtredData);
  };

  return {
    loading,
    data: chartData,
    setData,
    onDisabledColumns,
    disabledColumns,
    step,
    setStep,
    error
  };
};

export default useChart;
