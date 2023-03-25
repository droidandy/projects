import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { SettingSymbol } from './symbol';
import { Setting } from 'src/types-next';

// --- Actions ---
export const [handle, SettingActions, getSettingState] = createModule(
  SettingSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (setting: Setting | null) => ({
      payload: { setting },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<SettingState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const SiteSettingRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/site-settings/:id',
  component: <SiteSettingRoute />,
};

// --- Types ---
export interface SettingState {
  id: number;
  setting: Setting | null;
  isLoading: boolean;
  isSaving: boolean;
}
