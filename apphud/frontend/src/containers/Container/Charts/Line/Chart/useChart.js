import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import equal from "deep-equal";
import { getParamsForChartsRequest } from "./utils";
import ChartDataTransformer from "../../Charts/transformers/ChartDataTransformer";
import colors from "../../Charts/utils/colors";

// Hook
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
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
      setData(ChartDataTransformer.transform(data, colors, [], timezone));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [currentChart, range, filter, pagination, timezone]);

  return {
    loading,
    data: chartData,
    setData,
    step,
    setStep
  };
};

export default useChart;
