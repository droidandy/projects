import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ReportSymbol } from './symbol';

// --- Actions ---
export const [handle, ReportActions, getReportState] = createModule(
  ReportSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (report: any) => ({
      payload: { report },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<ReportState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ReportRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/reports/:id',
  component: <ReportRoute />,
};

// --- Types ---
export interface ReportState {
  report: any;
  isLoading: boolean;
  isSaving: boolean;
}
