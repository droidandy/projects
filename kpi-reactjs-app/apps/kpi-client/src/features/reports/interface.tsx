import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { 
  RouteConfig, 
  SortType, 
  Reports,
  SelectOption, 
} from 'src/types';
import { createModule } from 'typeless';
import { ReportsSymbol } from './symbol';

// --- Actions ---
export const [handle, ReportsActions, getReportsState] = createModule(
  ReportsSymbol
)
  .withActions({
    $mounted: null,
    search: null,
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    loadingDocument: (isLoading: boolean) => ({ payload: { isLoading } }),
    loaded: items => ({ payload: { items } }),
    setFilter: (name: keyof any, value: any) => ({
      payload: { name, value },
    }),
    clearFilter: null,
    setIsFilterExpanded: (isFilterExpanded: boolean) => ({
      payload: { isFilterExpanded },
    }),
    changePage: (pageIndex: number, pageSize?: number) => ({
      payload: { pageIndex, pageSize },
    }),
    downloadDocument: (type: string, lang: string, id: number) => ({
      payload: { type, lang, id },
    }),
    getDocument: (token: string | null) => ({
      payload: token,
    }),
  })
  .withState<ReportsState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));
const ReportsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);
export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/reports',
  component: <ReportsRoute />,
};

// --- Types ---
export interface ReportsState {
  filter: {
    searchText: '';
    type: SelectOption[];
  };
  isFilterExpanded: boolean;
  isLoading: boolean;
  isLoadingDocument: boolean;
  items: Reports[];
  sortType: SortType;
  sortBy: string;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
}
