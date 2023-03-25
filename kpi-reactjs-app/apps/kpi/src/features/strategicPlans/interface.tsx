import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { StrategicPlansSymbol } from './symbol';
import { OnPermission } from 'src/components/OnPermission';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { StrategicPlan } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  StrategicPlansActions,
  getStrategicPlansState,
] = createModule(StrategicPlansSymbol)
  .withActions({
    ...BaseListActions,
  })
  .withState<StrategicPlansState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const StrategicPlansRoute = () => (
  <DashboardSuspense>
    <OnPermission permission="strategic-plans:view" showError>
      <ModuleLoader />
    </OnPermission>
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/strategic-plans',
  component: <StrategicPlansRoute />,
};

// --- Types ---
export interface StrategicPlansState
  extends ListState<StrategicPlan, StrategicPlansFilter> {}

export interface StrategicPlansFilter {
  name: string;
}
