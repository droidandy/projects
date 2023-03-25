import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { ColorThemeSymbol as ColorThemesSymbol } from './symbol';
import { ColorTheme } from 'src/types-next';

// --- Actions ---
export const [handle, ColorThemesActions, getColorThemesState] = createModule(
  ColorThemesSymbol
)
  .withActions({
    ...BaseListActions,
  })
  .withState<ColorThemesState>();

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
  path: '/settings/color-themes',
  component: <ColorThemeRoute />,
};

// --- Types ---
export interface ColorThemesState extends ListState<ColorTheme, any> {}
