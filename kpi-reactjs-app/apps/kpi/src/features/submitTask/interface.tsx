import React from 'react';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { SubmitTaskSymbol } from './symbol';
import { Task, Kpi, DataSeries } from 'src/types-next';
import { DashboardSuspense } from 'src/components/DashboardSuspense';

// --- Actions ---
export const [handle, SubmitTaskActions, getSubmitTaskState] = createModule(
  SubmitTaskSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (task: Task, dataSeries: DataSeries, kpi: Kpi) => ({
      payload: { task, dataSeries, kpi },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    save: null,
  })
  .withState<SubmitTaskState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const SubmitTaskRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/my-tasks/:id/submit',
  component: <SubmitTaskRoute />,
};

// --- Types ---
export interface SubmitTaskState {
  task: Task;
  kpi: Kpi;
  dataSeries: DataSeries;
  isLoaded: boolean;
  isSaving: boolean;
}
