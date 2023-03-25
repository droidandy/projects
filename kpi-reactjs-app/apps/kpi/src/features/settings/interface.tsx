import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { SettingsSymbol } from './symbol';

// --- Actions ---
export const [handle] = createModule(SettingsSymbol);

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const SettingsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings',
  component: <SettingsRoute />,
};
