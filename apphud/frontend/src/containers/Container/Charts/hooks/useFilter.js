import React, { useState, useEffect } from "react";
import equal from "deep-equal";
import { useQueryParam, StringParam } from "use-query-params";

const base = {
  segment: null,
  filters: [],
  time_range: { step: 86400 },
  calc_method: ""
};

const charts = {
  ...base,
  segments: [{ id: "time_day" }],
  conversion: {
    value: "% of total",
    label: "% of total"
  }
};

const cohorts = {
  ...base,
  segments: [
    { id: null },
    { id: "time_month"}
  ]
};

export const filtersType = { charts, cohorts };

export const useFilterURL = (storageKey, defaultFilters) => {
  const [filters, setFilters] = useQueryParam("filters", StringParam);

  const getStorage = React.useCallback(() => {
    const storage = localStorage.getItem(`${storageKey}.filters`);
    return storage ? JSON.parse(storage) : defaultFilters || filtersType.charts;
  }, [storageKey]);

  const getFilterURL = React.useCallback(
    (ignoreURL = false) => {
      if (filters && !ignoreURL) {
        return JSON.parse(filters);
      }

      return getStorage();
    },
    [filters, storageKey, getStorage]
  );

  const setFilterURL = React.useCallback(
    (filters) => {
      if (storageKey) {
        localStorage.setItem(`${storageKey}.filters`, JSON.stringify(filters));
      }
      setFilters(JSON.stringify(filters));
    },
    [setFilters, storageKey]
  );

  return { getStorage, getFilterURL, setFilterURL };
}

export const useFilter = (storageKey = "charts.revenue", defaultFilters) => {
  const {getStorage, getFilterURL, setFilterURL} = useFilterURL(storageKey, defaultFilters);
  const [filter, setFilter] = useState(getStorage());

  useEffect(() => {
    setFilterURL(getFilterURL());
    setFilter(getStorage());
  }, [setFilterURL]);

  const isEqualFilter = React.useCallback(
    (e) => equal(filter, e),
    [filter]
  );

  const onSetFilter = React.useCallback(
    (key, val) => {
      console.log("onSetFilter:: ", key, val);
      console.log("getStorage:: ", getStorage());
      setFilterURL({ ...getStorage(), [key]: val });
      setFilter({ ...getStorage(), [key]: val });
    },
    [getStorage]
  );

  return {setFilterURL, getFilterURL, filter, onSetFilter, isEqualFilter};
}
