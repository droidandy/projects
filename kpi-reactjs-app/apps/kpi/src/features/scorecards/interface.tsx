import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ScorecardsSymbol } from './symbol';
import {
  BalancedScorecard,
  Resource,
  ObjectPerformance,
  FrequencyPeriod,
  KpiMeasure,
  KpiDataSeriesPerformance,
} from 'src/types-next';

// --- Actions ---
export const [handle, ScorecardsActions, getScorecardsState] = createModule(
  ScorecardsSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    load: null,
    scorecardLoaded: (
      scorecard: BalancedScorecard | null,
      period: FrequencyPeriod,
      performance: PerformanceData
    ) => ({
      payload: { scorecard, period, performance },
    }),
    setLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    resourceLoaded: (resource: null | Resource) => ({ payload: { resource } }),
    performanceLoaded: (performance: PerformanceData) => ({
      payload: { performance },
    }),
    setResourceId: (resourceId: null | number) => ({ payload: { resourceId } }),
    setSelectedTab: (selectedTab: string) => ({ payload: { selectedTab } }),
    save: (draft: boolean) => ({ payload: { draft } }),
    addNewItem: null,
    cancelAdd: null,
    updatePeriod: (period: FrequencyPeriod) => ({ payload: { period } }),
    resourceCreated: (resource: Resource) => ({ payload: { resource } }),
    resourceUpdated: (resource: Resource) => ({ payload: { resource } }),
    setWasCreated: (wasCreated: boolean) => ({ payload: { wasCreated } }),
    edit: null,
    cancelEdit: null,
  })
  .withState<ScorecardsState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ScorecardsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: ['/scorecards', '/scorecards/:type/:id'],
  component: <ScorecardsRoute />,
};

// --- Types ---
export interface ScorecardsState {
  isLoaded: boolean;
  scorecard: BalancedScorecard | null;
  scorecardItems: Resource[];
  resourceId: null | number;
  resource: null | Resource;
  isLoading: boolean;
  isSaving: boolean;
  selectedTab: string;
  isEditing: boolean;
  isAdding: boolean;
  period: FrequencyPeriod;
  wasCreated: boolean;
  performance: PerformanceData;
}

export interface PerformanceData {
  widget: ObjectPerformance[];
  history: ObjectPerformance[];
  status: KpiDataSeriesPerformance[];
  measures: KpiMeasure[];
}
