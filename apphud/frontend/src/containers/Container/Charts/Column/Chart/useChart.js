import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import equal from "deep-equal";
import { getParamsForChartsRequest } from "./utils";
import ChartDataColumnTransformer from "../../Charts/transformers/ChartDataColumnTransformer";
import colors from "../../Charts/utils/colors";

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
      const appId = location.pathname.split("/")[2];
      const params = getParamsForChartsRequest({appId, range, currentChart, filter, timezone, type, pagination})
      const { data } = await axios.post(`/api/v1/chart/query/${type}`, params);

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

        return ChartDataColumnTransformer.transform(newData, colors, []);
      });


      setLoading(false);
    } catch (err) {
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
    setStep
  };
};

export default useChart;
