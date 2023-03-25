import React from 'react';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ExcellenceSymbol } from './symbol';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { ExcellenceRequirement } from 'src/types-next';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';

// --- Actions ---
export const [handle, ExcellenceActions, getExcellenceState] = createModule(
  ExcellenceSymbol
)
  .withActions({
    ...BaseListActions,
    onDelete: (item: ExcellenceRequirement) => ({ payload: { item } }),
  })
  .withState<ExcellenceState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ExcellenceRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/excellence',
  component: <ExcellenceRoute />,
};

// --- Types ---
export interface ExcellenceState
  extends ListState<ExcellenceRequirement, any> {}
