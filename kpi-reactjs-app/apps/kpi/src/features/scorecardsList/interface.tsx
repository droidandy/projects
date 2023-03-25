import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ScorecardsListSymbol } from './symbol';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { BalancedScorecard } from 'src/types-next';

export const [
  handle,
  ScorecardsListActions,
  getScorecardsListState,
] = createModule(ScorecardsListSymbol)
  .withActions({
    ...BaseListActions,
    onDelete: (scorecard: BalancedScorecard) => ({ payload: { scorecard } }),
  })
  .withState<ScorecardsListState>();

const ModuleLoader = React.lazy(() => import('./module'));

const ScorecardsListRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/scorecards',
  component: <ScorecardsListRoute />,
};

export interface ScorecardsListState
  extends ListState<BalancedScorecard, ScorecardsListFilter> {}

export interface ScorecardsListFilter {
  strategicPlanId: number;
  enabled: boolean;
}
