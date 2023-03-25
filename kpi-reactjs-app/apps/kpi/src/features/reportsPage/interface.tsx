import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { ReportsPageSymbol } from './symbol';

// --- Actions ---
export const [handle, ReportsPageActions, getReportsPageState] = createModule(
  ReportsPageSymbol
)
  .withActions({
    ...BaseListActions,
  })
  .withState<ReportsPageState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));
const ReportsPageRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);
export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/reports-page',
  component: <ReportsPageRoute />,
};

// --- Types ---
export interface ReportsPageState extends ListState<any, any> {}
