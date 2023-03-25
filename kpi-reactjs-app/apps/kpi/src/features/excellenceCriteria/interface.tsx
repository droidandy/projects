import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ExcellenceCriteriaSymbol } from './symbol';
import { ExcellenceCriteria } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  ExcellenceCriteriaActions,
  getExcellenceCriteriaState,
] = createModule(ExcellenceCriteriaSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (
      criterias: ExcellenceCriteria[],
      excellenceCriteria: ExcellenceCriteria | null
    ) => ({
      payload: { criterias, excellenceCriteria },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<ExcellenceCriteriaState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ExcellenceCriteriaRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/excellence-criterias/:id',
  component: <ExcellenceCriteriaRoute />,
};

// --- Types ---
export interface ExcellenceCriteriaState {
  id: number;
  excellenceCriteria: ExcellenceCriteria | null;
  excellenceCriterias: ExcellenceCriteria[] | null;
  isLoading: boolean;
  isSaving: boolean;
}
