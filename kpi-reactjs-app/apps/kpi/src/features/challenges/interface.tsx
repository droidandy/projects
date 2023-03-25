import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ChallengesSymbol } from './symbol';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { Challenge } from 'src/types-next';

// --- Actions ---
export const [handle, ChallengesActions, getChallengesState] = createModule(
  ChallengesSymbol
)
  .withActions({
    ...BaseListActions,
    onDelete: (challenge: Challenge) => ({ payload: { challenge } }),
  })
  .withState<ChallengesState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ChallengesRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/challenges',
  component: <ChallengesRoute />,
};

// --- Types ---
export interface ChallengesState extends ListState<Challenge, any> {}
