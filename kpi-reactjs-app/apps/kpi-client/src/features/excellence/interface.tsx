import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig, CalcExcellence, CalcStatusExcellence } from 'src/types';
import { createModule } from 'typeless';
import { ExcellenceSymbol } from './symbol';
import { ExcellenceRequirement } from 'shared/types';

// --- Actions ---
export const [handle, ExcellenceActions, getExcellenceState] = createModule(
  ExcellenceSymbol
)
  .withActions({
    $mounted: null,
    search: null,
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    loaded: (items: ExcellenceRequirement[]) => ({ payload: { items } }),
    setFilter: (name: keyof ExcellenceFilter, value: any) => ({
      payload: { name, value },
    }),
    clearFilter: null,
    applyFilter: null,
    setIsFilterExpanded: (isFilterExpanded: boolean) => ({
      payload: { isFilterExpanded },
    }),
  })
  .withState<ExcellenceState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ExcellenceRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/excellence',
  component: <ExcellenceRoute />,
};

// --- Types ---
export interface ExcellenceState {
  isFilterExpanded: boolean;
  filter: ExcellenceFilter;
  tempFilter: ExcellenceFilter;
  items: CalcExcellence[];
  isLoading: boolean;
}

export interface ExcellenceFilter {
  status: CalcStatusExcellence[];
}
