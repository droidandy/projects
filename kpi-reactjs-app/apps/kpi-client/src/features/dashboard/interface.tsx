import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import {
  RouteConfig,
  Dashboard,
  StrategicPlan,
  DashboardPerformanceType,
  FrequencyPeriod,
  ReportStatsWithColor,
  OrganizationUnit,
  SelectOption,
} from 'src/types';
import { createModule } from 'typeless';
import { DashboardSymbol } from './symbol';

// --- Actions ---
export const [handle, DashboardActions, getDashboardState] = createModule(
  DashboardSymbol
)
  .withActions({
    $mounted: null,
    load: null,
    loaded: (dashboard: Dashboard, strategicPlan: StrategicPlan) => ({
      payload: { dashboard, strategicPlan },
    }),
  })
  .withState<DashboardState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const DashboardRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: ['/', '/dashboard/:id'],
  component: <DashboardRoute />,
};

// --- Types ---
export interface DashboardState {
  isLoaded: boolean;
  dashboard: Dashboard;
  strategicPlan: StrategicPlan;
}

export type PerformanceMap = {
  [x in DashboardPerformanceType]: PerformanceItem;
};

export interface PerformanceItem {
  period: FrequencyPeriod;
  items: ReportStatsWithColor[];
  overall: ReportStatsWithColor;
  isLoading: boolean;
}

export type UnitPerformanceMap = {
  [x in DashboardPerformanceType]: UnitPerformanceWidget;
};

export interface UnitPerformanceWidget {
  period: FrequencyPeriod;
  unitOptions: SelectOption<OrganizationUnit>[];
  unit: SelectOption<OrganizationUnit> | null;
  stats: ReportStatsWithColor;
  isLoading: boolean;
}
