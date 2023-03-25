import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { SiteSettingsSymbol } from './symbol';
import { Setting } from 'src/types-next';

// --- Actions ---
export const [handle, SiteSettingsActions, getSiteSettingsState] = createModule(
  SiteSettingsSymbol
)
  .withActions({
    ...BaseListActions,
  })
  .withState<SiteSettingsState>();
// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));
const SiteSettingsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);
export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/site-settings',
  component: <SiteSettingsRoute />,
};
// --- Types ---
export interface SiteSettingsState extends ListState<Setting, any> {}
