import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ColorThemeSymbol } from './symbol';
import { ColorTheme } from 'src/types-next';

// --- Actions ---
export const [handle, ColorThemeActions, getColorThemeState] = createModule(
  ColorThemeSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (colorTheme: ColorTheme | null) => ({
      payload: { colorTheme },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<ColorThemeState>();

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
  path: '/settings/color-themes/:id',
  component: <ColorThemeRoute />,
};

// --- Types ---
export interface ColorThemeState {
  id: number;
  colorTheme: ColorTheme | null;
  isLoading: boolean;
  isSaving: boolean;
}
