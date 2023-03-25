import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { StrategicPlan, StrategicPlanItem, FileDocument } from 'src/types-next';
import { createModule } from 'typeless';
import { StrategicPlanSymbol } from './symbol';
import { OnPermission } from 'src/components/OnPermission';

// --- Actions ---
export const [
  handle,
  StrategicPlanActions,
  getStrategicPlanState,
] = createModule(StrategicPlanSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (strategicPlan: StrategicPlan | null) => ({
      payload: { strategicPlan },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    validateForm: () => ({}),
    uploadIcon: (item: any) => ({ payload: item }),
    setIcon: (item: any) => ({ payload: item }),
    setValues: (item: any) => ({ payload: item }),
    deleteValue: (id: number) => ({ payload: id }),
    clearValueIcon: () => ({}),
  })
  .withState<StrategicPlanState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const StrategicPlanRoute = () => (
  <DashboardSuspense>
    <OnPermission permission="strategic-plan:view" showError>
      <ModuleLoader />
    </OnPermission>
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/strategic-plans/:id',
  component: <StrategicPlanRoute />,
};

export interface StrategicPlanIcon {
  icon?: FileDocument | null;
  iconId: number | null;
  field?: string;
}

// --- Types ---
export interface StrategicPlanState {
  id: string;
  strategicPlan: StrategicPlan | null;
  isLoading: boolean;
  isSaving: boolean;
  icons: StrategicPlanIcon[];
  values: StrategicPlanItem[];
}
