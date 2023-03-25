import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { RouteConfig, OrganizationUnit, ExcellenceCriteria } from 'src/types';
import { createModule } from 'typeless';
import { CreateExcellenceSymbol } from './symbol';
import { ExcellenceTheme } from 'shared/types';

// --- Actions ---
export const [
  handle,
  CreateExcellenceActions,
  getCreateExcellenceState,
] = createModule(CreateExcellenceSymbol)
  .withActions({
    $init: null,
    $mounted: null,
    save: null,
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    unitsLoaded: (units: OrganizationUnit[]) => ({ payload: { units } }),
    criteriasLoaded: (criteria: ExcellenceCriteria[]) => ({
      payload: { criteria },
    }),
    themesLoaded: (themes: ExcellenceTheme[]) => ({
      payload: { themes },
    }),
  })
  .withState<CreateExcellenceState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const CreateExcellenceRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/create-excellence',
  component: <CreateExcellenceRoute />,
};

// --- Types ---
export interface CreateExcellenceState {
  isSaving: boolean;
  units: OrganizationUnit[] | null;
  criteria: ExcellenceCriteria[] | null;
  themes: ExcellenceTheme[] | null;
}
