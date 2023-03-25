import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import {
  RouteConfig,
  SortType,
  OrganizationUnit,
  ExcellenceRequirement,
} from 'src/types';
import { createModule } from 'typeless';
import { ExcellenceReportsSymbol } from './symbol';

// --- Actions ---
export const [
  handle,
  ExcellenceReportsActions,
  getExcellenceReportsState,
] = createModule(ExcellenceReportsSymbol)
  .withActions({
    $mounted: null,
    search: null,
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    loadedUnits: (items: OrganizationUnit[]) => ({ payload: { items } }),
    loaded: (items: ExcellenceRequirement[]) => ({ payload: { items } }),
    setFilter: (name: keyof any, value: any) => ({
      payload: { name, value },
    }),
    changeSortType: (sortType: SortType, sortBy?: string) => ({
      payload: { sortType, sortBy },
    }),
    initialFilter: (filters: any, units: OrganizationUnit[]) => ({
      payload: { filters, units },
    }),
    clearFilters: () => ({}),
  })
  .withState<ExcellenceReportsState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ExcellenceReportsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/excellence-reports',
  component: <ExcellenceReportsRoute />,
};
// --- Types ---
export interface ExcellenceReportsState {
  units: OrganizationUnit[];
  filter: any;
  isLoading: boolean;
  items: ExcellenceRequirement[];
  sortType: SortType;
  sortBy: string;
  pageSize: number;
}
