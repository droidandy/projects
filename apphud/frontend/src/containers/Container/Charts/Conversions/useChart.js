import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import equal from "deep-equal";
import {getParamsForChartsRequest} from "./Chart/utils";
import ChartDataConverions from "../Charts/transformers/ChartDataConverions";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
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
                return ChartDataConverions.transform(newData, conversion);
            });
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
