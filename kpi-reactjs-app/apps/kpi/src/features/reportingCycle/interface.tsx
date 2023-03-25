import React from 'react';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ReportingCycleSymbol } from './symbol';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { ReportingCycle } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  ReportingCycleActions,
  getReportingCycleState,
] = createModule(ReportingCycleSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (reportingCycle: ReportingCycle) => ({
      payload: { reportingCycle },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    save: (saveType: ReportingCycleSaveType) => ({ payload: { saveType } }),
    setSubmitted: null,
  })
  .withState<ReportingCycleState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ReportingCycleRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/reporting-cycle/:id',
  component: <ReportingCycleRoute />,
};

// --- Types ---
export interface ReportingCycleState {
  isLoaded: boolean;
  reportingCycle: ReportingCycle;
  isSaving: boolean;
  isSubmitted: boolean;
  saveType: ReportingCycleSaveType | null;
}

export type ReportingCycleSaveType = 'submit' | 'hold';
