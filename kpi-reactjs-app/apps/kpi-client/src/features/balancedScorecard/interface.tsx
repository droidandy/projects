import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import {
  RouteConfig,
  FrequencyPeriod,
  BalancedScorecard,
  BalancedScorecardItemAllowedParent,
} from 'src/types';
import { createModule } from 'typeless';
import { BalancedScorecardSymbol } from './symbol';
import {
  BalancedScorecardItemType,
  BalancedScorecardItem,
  ReportStats,
} from 'shared/types';

// --- Actions ---
export const [
  handle,
  BalancedScorecardActions,
  getBalancedScorecardState,
] = createModule(BalancedScorecardSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    load: null,
    loaded: (
      scorecards: BalancedScorecard[],
      parentTypes: BalancedScorecardItemAllowedParent[]
    ) => ({
      payload: { scorecards, parentTypes },
    }),
    loadScorecard: (id: number) => ({ payload: { id } }),
    changeScorecard: (id: number) => ({ payload: { id } }),
    scorecardLoaded: (scorecard: BalancedScorecard, stats: ReportStats) => ({
      payload: { scorecard, stats },
    }),
    changePeriod: (period: FrequencyPeriod) => ({ payload: { period } }),
    addItem: (
      type: BalancedScorecardItemType,
      parent: BalancedScorecardItem | null,
      name: string,
      callback: (result: 'clear' | 'error') => any
    ) => ({
      payload: {
        type,
        parent,
        name,
        callback,
      },
    }),
    itemCreated: (item: BalancedScorecardItem) => ({ payload: { item } }),
    changeViewMode: (viewMode: BscViewMode) => ({ payload: { viewMode } }),
  })
  .withState<BalancedScorecardState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const BalancedScorecardRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/bsc',
  component: <BalancedScorecardRoute />,
};

export type BscViewMode = 'tree' | 'table';

// --- Types ---
export interface BalancedScorecardState {
  isLoaded: boolean;
  parentTypes: BalancedScorecardItemAllowedParent[];
  isStatsLoading: boolean;
  isScorecardLoading: boolean;
  scorecard: BalancedScorecard;
  scorecards: BalancedScorecard[];
  stats: ReportStats;
  viewMode: BscViewMode;
}

export interface ScorecardQueryFilter extends FrequencyPeriod {
  scorecardId: number;
}
