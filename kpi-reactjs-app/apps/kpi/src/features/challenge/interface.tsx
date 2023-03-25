import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ChallengeSymbol } from './symbol';
import { Challenge, Resource, OrganizationUnit } from 'src/types-next';

// --- Actions ---
export const [handle, ChallengeActions, getChallengeState] = createModule(
  ChallengeSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (
      challenge: Challenge | null,
      units: OrganizationUnit[],
      resources: Resource[] | null
    ) => ({ payload: { challenge, units, resources } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    setDeleting: (isDeleting: boolean) => ({ payload: { isDeleting } }),
    remove: null,
    setResources: (resources: Resource[] | null) => ({
      payload: {
        resources,
      },
    }),
    save: (draft: boolean) => ({ payload: { draft } }),
  })
  .withState<ChallengeState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ChallengeRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/challenges/:id',
  component: <ChallengeRoute />,
};

// --- Types ---
export interface ChallengeState {
  challenge: Challenge | null;
  resources: Resource[] | null;
  units: OrganizationUnit[] | null;
  isLoaded: boolean;
  isDeleting: boolean;
  isSaving: boolean;
}
