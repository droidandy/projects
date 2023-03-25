import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { BalancedScorecard } from 'src/types-next';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ScorecardListSymbol } from './symbol';

export const [
  handle,
  ScorecardListActions,
  getScorecardListState,
] = createModule(ScorecardListSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (scorecard: BalancedScorecard | null) => ({
      payload: { scorecard },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    setDeleting: (isDeleting: boolean) => ({ payload: { isDeleting } }),
    remove: null,
  })
  .withState<ScorecardListState>();

const ModuleLoader = React.lazy(() => import('./module'));

const ScorecardListRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/scorecards/:id',
  component: <ScorecardListRoute />,
};

export interface ScorecardListState {
  id: string;
  scorecardList: BalancedScorecard | null;
  isLoading: boolean;
  isDeleting: boolean;
  isSaving: boolean;
}
