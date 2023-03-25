import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { ExcellenceCriteriaSymbol as ExcellenceCriteriasSymbol } from './symbol';
import { ExcellenceCriteria } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  ExcellenceCriteriasActions,
  getExcellenceCriteriasState,
] = createModule(ExcellenceCriteriasSymbol)
  .withActions({
    ...BaseListActions,
  })
  .withState<ExcellenceCriteriasState>();

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
  path: '/settings/excellence-criterias',
  component: <ExcellenceCriteriaRoute />,
};

// --- Types ---
export interface ExcellenceCriteriasState
  extends ListState<ExcellenceCriteria, ExcellenceCriteriasFilter> {}

export interface ExcellenceCriteriasFilter {
  name: string;
  parentId: number | null;
}
