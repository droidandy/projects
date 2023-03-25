import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ReportPageSymbol } from './symbol';
import { ReportPage } from 'src/types-next';

// --- Actions ---
export const [handle, ReportPageActions, getReportPageState] = createModule(
  ReportPageSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (reportPage: any) => ({
      payload: { reportPage },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<ReportPageState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ReportPageRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/reports-page/:id',
  component: <ReportPageRoute />,
};

// --- Types ---
export interface ReportPageState {
  reportPage: ReportPage | null;
  isLoading: boolean;
  isSaving: boolean;
}
