import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ChallengeTaskSymbol } from './symbol';
import { Challenge, ChallengeAction, TaskType } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  ChallengeTaskActions,
  getChallengeTaskState,
] = createModule(ChallengeTaskSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (
      challenge: Challenge,
      actions: ChallengeAction[],
      taskType: TaskType
    ) => ({
      payload: { challenge, actions, taskType },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    addChallengeAction: (action: ChallengeAction) => ({ payload: { action } }),
    save: null,
    addComment: (
      challengeActionId: number,
      comment: string,
      callback: (action: 'startLoading' | 'clear' | 'stopLoading') => any
    ) => ({
      payload: {
        challengeActionId,
        comment,
        callback,
      },
    }),
    commentCreated: (comment: any) => ({ payload: { comment } }),
  })
  .withState<ChallengeTaskState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ChallengeTaskRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: [
    '/my-tasks/:id/ChallengeResponse',
    '/my-tasks/:id/ChallengeResponseReview',
  ],
  component: <ChallengeTaskRoute />,
};

// --- Types ---
export interface ChallengeTaskState {
  challenge: Challenge;
  actions: ChallengeAction[];
  isLoaded: boolean;
  isSaving: boolean;
  taskType: TaskType;
}
