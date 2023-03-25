import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { DataSourcesSymbol } from './symbol';

// --- Actions ---
export const [handle] = createModule(DataSourcesSymbol);

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const DataSourcesRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/strategy-items',
  component: <DataSourcesRoute />,
};
