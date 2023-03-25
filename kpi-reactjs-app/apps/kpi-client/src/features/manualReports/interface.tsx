import React from 'react';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ManualReportsSymbol } from './symbol';
import { DashboardSuspense } from 'src/components/DashboardSuspense';

// --- Actions ---
export const [
  handle,
  ManualReportsActions,
  getManualReportsState,
] = createModule(ManualReportsSymbol)
  .withActions({
    $mounted: null,
    get: null,
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    loaded: (items: any) => ({ payload: { items } }),
  })
  .withState<ManualReportsState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ManualReportsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/manual-reports',
  component: <ManualReportsRoute />,
};

// --- Types ---
export interface ManualReportsState {
  items: any[];
  isLoading: boolean;
}
