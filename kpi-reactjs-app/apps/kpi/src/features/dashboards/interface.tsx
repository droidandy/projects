import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { DashboardsSymbol } from './symbol';
import { Dashboard } from 'src/types-next';

// --- Actions ---
export const [handle, DashboardsActions, getDashboardsState] = createModule(
  DashboardsSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    loaded: (dashboards: Dashboard[]) => ({
      payload: { dashboards },
    }),
    selectDashboard: (dashboard: Dashboard) => ({ payload: { dashboard } }),
  })
  .withState<DashboardsState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const DashboardsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/',
  component: <DashboardsRoute />,
};

// --- Types ---
export interface DashboardsState {
  isLoaded: boolean;
  dashboards: Dashboard[];
  selected: Dashboard;
}
