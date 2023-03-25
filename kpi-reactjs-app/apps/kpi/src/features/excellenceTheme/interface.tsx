import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ExcellenceThemeSymbol } from './symbol';
import { ExcellenceTheme } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  ExcellenceThemeActions,
  getExcellenceThemeState,
] = createModule(ExcellenceThemeSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (excellenceTheme: ExcellenceTheme | null) => ({
      payload: { excellenceTheme },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<ExcellenceThemeState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ColorThemeRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/excellence-themes/:id',
  component: <ColorThemeRoute />,
};

// --- Types ---
export interface ExcellenceThemeState {
  id: number;
  excellenceTheme: ExcellenceTheme | null;
  isLoading: boolean;
  isSaving: boolean;
}
