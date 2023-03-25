import React from 'react';
import {
  RouteConfig,
  FrequencyPeriod,
  SortType,
  SelectOption,
  DataSeries,
} from 'src/types';
import { createModule } from 'typeless';
import { DataEntrySymbol } from './symbol';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { ObjectPerformance, UserKpiReport } from 'shared/types';

// --- Actions ---
export const [handle, DataEntryActions, getDataEntryState] = createModule(
  DataEntrySymbol
)
  .withActions({
    $mounted: null,
    search: null,
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    loaded: (items: UserKpiReport[]) => ({
      payload: { items },
    }),
    changePeriod: (period: FrequencyPeriod) => ({ payload: { period } }),
    setFilter: (name: keyof DataEntryFilter, value: any) => ({
      payload: { name, value },
    }),
    updateActualValue: (dataSeries: DataSeries, value: number | null) => ({
      payload: { dataSeries, value },
    }),
    performanceUpdated: (
      kpiId: number,
      yearly: ObjectPerformance,
      performance: ObjectPerformance
    ) => ({
      payload: { kpiId, yearly, performance },
    }),
    clearFilter: null,
    setIsFilterExpanded: (isFilterExpanded: boolean) => ({
      payload: { isFilterExpanded },
    }),
    save: (
      saveType: ReportSaveType,
      report: UserKpiReport,
      callback: () => void
    ) => ({
      payload: { saveType, report, callback },
    }),
    setSubmitted: (report: UserKpiReport) => ({ payload: { report } }),
    markProcessed: (id: number) => ({ payload: { id } }),
  })
  .withState<DataEntryState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const DataEntryRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/data-entry',
  component: <DataEntryRoute />,
};

// --- Types ---
export interface DataEntryState {
  period: FrequencyPeriod;
  filter: DataEntryFilter;
  items: UserKpiReport[];
  isLoading: boolean;
  sortType: SortType;
  sortBy: string;
  isFilterExpanded: boolean;
  processedMap: Record<string, boolean>;
}

export interface DataEntryFilter {
  searchTerm: '';
  colors: SelectOption[];
  frequencies: SelectOption[];
  aggregationTypes: SelectOption[];
  kpiTypes: SelectOption[];
}

export type ReportSaveType = 'reject' | 'approve' | 'submit';
