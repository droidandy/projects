import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig, Metric } from 'src/types';
import { createModule } from 'typeless';
import { MetricSymbol } from './symbol';
import { OnPermission } from 'src/components/OnPermission';

// --- Actions ---
export const [handle, MetricActions, getMetricState] = createModule(
  MetricSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (metric: Metric | null) => ({ payload: { metric } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    setDeleting: (isDeleting: boolean) => ({ payload: { isDeleting } }),
    remove: null,
  })
  .withState<MetricState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const MetricRoute = () => (
  <DashboardSuspense>
    <OnPermission permission="metric:view" showError>
      <ModuleLoader />
    </OnPermission>
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/metrics/:id',
  component: <MetricRoute />,
};

// --- Types ---
export interface MetricState {
  id: string;
  metric: Metric | null;
  isLoading: boolean;
  isDeleting: boolean;
  isSaving: boolean;
}
