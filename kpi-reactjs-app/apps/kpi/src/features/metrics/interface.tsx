import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig, Metric } from 'src/types';
import { createModule } from 'typeless';
import { MetricsSymbol } from './symbol';
import { OnPermission } from 'src/components/OnPermission';
import { BaseListActions, ListState } from 'src/mixins/listMixin';

// --- Actions ---
export const [handle, MetricsActions, getMetricsState] = createModule(
  MetricsSymbol
)
  .withActions({
    ...BaseListActions,
  })
  .withState<MetricsState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const MetricsRoute = () => (
  <DashboardSuspense>
    <OnPermission permission="metrics:view" showError>
      <ModuleLoader />
    </OnPermission>
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/metrics',
  component: <MetricsRoute />,
};

// --- Types ---
export interface MetricsState extends ListState<Metric, MetricFilter> {}

export interface MetricFilter {
  name: string;
  enabled: boolean | null;
  metricType: string;
  dataType: string;
  dataSource: string;
}
