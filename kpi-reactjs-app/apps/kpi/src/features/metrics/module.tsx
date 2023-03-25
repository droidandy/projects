import React from 'react';
import { MetricsView } from './components/MetricsView';
import {
  MetricsActions,
  MetricsState,
  handle,
  getMetricsState,
} from './interface';
import { searchMetrics, exportMetrics } from 'src/services/API';
import { mixinList, defaultListInitialState } from 'src/mixins/listMixin';

const initialState: MetricsState = {
  ...defaultListInitialState,
  sortBy: 'name',
  filter: {
    name: '',
    enabled: null,
    metricType: '',
    dataType: '',
    dataSource: '',
  },
  appliedFilter: {
    name: '',
    enabled: null,
    metricType: '',
    dataType: '',
    dataSource: '',
  },
};

mixinList({
  handle,
  initialState,
  Actions: MetricsActions,
  searchCriteria: {
    name: 'string',
    enabled: 'bool',
    metricType: 'string',
    dataType: 'string',
    dataSource: 'string',
  },
  getState: getMetricsState,
  search: searchMetrics,
  exportItems: exportMetrics,
});

// --- Module ---
export default () => {
  handle();
  return <MetricsView />;
};
