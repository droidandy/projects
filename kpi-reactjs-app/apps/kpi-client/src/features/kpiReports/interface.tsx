import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import {
  RouteConfig,
  SortType,
  FrequencyPeriod,
  OrganizationUnit,
  KPIReports,
} from 'src/types';
import { createModule } from 'typeless';
import { KPIReportsSymbol } from './symbol';

// --- Actions ---
export const [handle, KPIReportsActions, getKPIReportsState] = createModule(
  KPIReportsSymbol
)
  .withActions({
    $mounted: null,
    search: null,
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    loadedUnits: (items: OrganizationUnit[]) => ({ payload: { items } }),
    loaded: (items: KPIReports[]) => ({ payload: { items } }),
    setFilter: (name: keyof any, value: any) => ({
      payload: { name, value },
    }),
    changePeriod: (period: FrequencyPeriod) => ({ payload: { period } }),
    changePage: (pageIndex: number, pageSize?: number) => ({
      payload: { pageIndex, pageSize },
    }),
    changeSortType: (sortType: SortType, sortBy?: string) => ({
      payload: { sortType, sortBy },
    }),
    initialFilter: (filters: any, units: OrganizationUnit[]) => ({
      payload: { filters, units },
    }),
    clearFilters: () => ({}),
    setIsFilterExpanded: (isFilterExpanded: boolean) => ({
      payload: { isFilterExpanded },
    }),
  })
  .withState<KPIReportsState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const KPIReportsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/kpi-reports',
  component: <KPIReportsRoute />,
};
// --- Types ---
export interface KPIReportsState {
  units: OrganizationUnit[];
  period: FrequencyPeriod;
  filter: any;
  isLoading: boolean;
  items: KPIReports[];
  sortType: SortType;
  sortBy: string;
  pageSize: number;
  isFilterExpanded: boolean;
  // pagination?: {
  //   pageIndex: number;
  //   pageSize: number;
  //   totalCount: number;
  // };
}
