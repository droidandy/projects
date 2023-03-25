import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig, OrganizationStructure } from 'src/types';
import { OrganizationUnit, PartialBy } from 'src/types-next';
import { createModule } from 'typeless';
import { OrganizationStructureSymbol } from './symbol';
import { OnPermission } from 'src/components/OnPermission';

type OrganizationUnitPlayload = PartialBy<
  PartialBy<OrganizationUnit, 'id'>,
  'parentId'
>;

// --- Actions ---
export const [
  handle,
  OrganizationStructureActions,
  getOrganizationStructureState,
] = createModule(OrganizationStructureSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    load: null,
    loaded: (items: OrganizationStructure[] | null) => ({ payload: { items } }),
    update: (items: OrganizationStructure[]) => ({ payload: { items } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    setLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    removeItem: (item: OrganizationUnit) => ({ payload: { item } }),
    updateItem: (
      item: OrganizationUnitPlayload,
      prevStateItems?: OrganizationStructure[]
    ) => ({
      payload: { item, prevStateItems },
    }),
    showForm: (item: OrganizationUnit | null) => ({ payload: { item } }),
    hideForm: null,
    addItem: (item: OrganizationUnitPlayload) => ({ payload: { item } }),
    returnPrevItems: (item: OrganizationStructure[]) => ({ payload: item }),
  })
  .withState<OrganizationStructureState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const OrganizationStructureRoute = () => (
  <DashboardSuspense>
    <OnPermission permission="organization-structure:view" showError>
      <ModuleLoader />
    </OnPermission>
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/organization-structure',
  component: <OrganizationStructureRoute />,
};

// --- Types ---
export interface OrganizationStructureState {
  items: OrganizationStructure[] | null;
  isLoading: boolean;
  isSaving: boolean;
  isFormVisible: boolean;
  formEditItem: OrganizationUnit | null;
}
