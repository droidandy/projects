import React, { useState, useEffect } from "react";
import moment from "moment";
import equal from "deep-equal";
import { useQueryParam, StringParam } from "use-query-params";
import { generatePeriod, track } from "../../../../libs/helpers";

export const usePeriodURL = (storageKey = "charts") => {
  const [start_time, setStartTime] = useQueryParam("start_time", StringParam);
  const [end_time, setEndTime] = useQueryParam("end_time", StringParam);
  const getPeriodURL = React.useCallback(
    () => {
      if (start_time && end_time) {
        return { start_time, end_time }
      }

      const getStorage = localStorage.getItem(`${storageKey}.period`);
      return getStorage ? JSON.parse(getStorage) : generatePeriod("last_7_days");
    },
    [start_time, end_time]
  );

  const setPeriodURL = React.useCallback(
    (start, end, format = "YYYY-MM-DD") => {
      if (storageKey) {
        localStorage.setItem(`${storageKey}.period`, JSON.stringify({ start_time: start, end_time: end }));
      }
      setStartTime(moment(start).format(format));
      setEndTime(moment(end).format(format));

    },
    [setStartTime, setEndTime]
  );

  return { getPeriodURL, setPeriodURL };
}

export const usePeriod = (storageKey = "charts") => {
  const {getPeriodURL, setPeriodURL} = usePeriodURL(storageKey);
  const getPeriod = getPeriodURL();

  const [period, setPeriod] = useState({
    from: getPeriod.start_time,
    to: getPeriod.end_time
  });

  useEffect(() => {
    setPeriodURL(getPeriod.start_time, getPeriod.end_time);
  }, []);

  const isEqualPeriod = React.useCallback(
    (e) => {
      const newPeriod = {
        from: moment(e.startDate).format("YYYY-MM-DD HH:mm:ss"),
        to: moment(e.endDate).format("YYYY-MM-DD HH:mm:ss")
      };

      return equal(period, newPeriod);
    },
    [period]
  );

  const onSetPeriod = React.useCallback(
    (e) => {
      const newPeriod = {
        from: moment(e.startDate).format("YYYY-MM-DD HH:mm:ss"),
        to: moment(e.endDate).format("YYYY-MM-DD HH:mm:ss")
      };

      if (!equal(period, newPeriod)) {
        setPeriodURL(e.startDate, e.endDate);
        setPeriod(newPeriod);
        track(`${storageKey}_date_range_changed`, newPeriod);
      }
    },
    [period]
  );

  return {setPeriodURL, period, onSetPeriod, isEqualPeriod};
}
