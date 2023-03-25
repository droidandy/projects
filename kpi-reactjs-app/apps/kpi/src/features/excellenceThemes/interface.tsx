import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { ExcellenceThemeSymbol as ExcellenceThemesSymbol } from './symbol';
import { ExcellenceTheme } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  ExcellenceThemesActions,
  getExcellenceThemesState,
] = createModule(ExcellenceThemesSymbol)
  .withActions({
    ...BaseListActions,
  })
  .withState<ExcellenceThemesState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ExcellenceThemeRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/excellence-themes',
  component: <ExcellenceThemeRoute />,
};

// --- Types ---
export interface ExcellenceThemesState
  extends ListState<ExcellenceTheme, ExcellenceThemesFilter> {}

export interface ExcellenceThemesFilter {
  name: string;
}
