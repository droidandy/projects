import React from 'react';
import {
  RouteConfig,
  FrequencyPeriod,
  SortType,
  MyKpiMeasureItem,
  SelectOption,
} from 'src/types';
import { createModule } from 'typeless';
import { MyKpisSymbol } from './symbol';
import { DashboardSuspense } from 'src/components/DashboardSuspense';

// --- Actions ---
export const [handle, MyKpisActions, getMyKpisState] = createModule(
  MyKpisSymbol
)
  .withActions({
    $mounted: null,
    search: null,
    applyFilter: null,
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    loaded: (items: MyKpiMeasureItem[]) => ({ payload: { items } }),
    changePeriod: (period: FrequencyPeriod) => ({ payload: { period } }),
    setIsFilterExpanded: (isFilterExpanded: boolean) => ({
      payload: { isFilterExpanded },
    }),
    setFilter: (name: keyof MyKpisFilter, value: any) => ({
      payload: { name, value },
    }),
    clearFilter: null,
  })
  .withState<MyKpisState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const MyKpisRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/my-kpis',
  component: <MyKpisRoute />,
};

// --- Types ---
export interface MyKpisState {
  period: FrequencyPeriod;
  isLoading: boolean;
  isFilterExpanded: boolean;
  items: MyKpiMeasureItem[];
  sortType: SortType;
  sortBy: string;
  filter: MyKpisFilter;
  tempFilter: MyKpisFilter;
  periodChanged: boolean;
}

export interface MyKpisFilter {
  aggregation: SelectOption | null;
  scoringType: SelectOption | null;
  level: SelectOption | null;
  frequency: SelectOption | null;
  status: SelectOption | null;
  kpiCode: string;
  kpiName: string;
}
