import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { InitiativesSymbol } from './symbol';
import {
  Initiative,
  InitiativeItemProgress,
  Skill,
  RiskManagementItem,
} from 'src/types-next';

// --- Actions ---
export const [handle, InitiativesActions, getInitiativesState] = createModule(
  InitiativesSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    load: null,
    initiativesLoaded: (
      initiatives: Initiative[],
      items: InitiativeItemProgress[]
    ) => ({
      payload: { initiatives, items },
    }),
    initiativeLoaded: (
      initiative: Initiative | null,
      items: InitiativeItemProgress[],
      skills: Skill[],
      risks: RiskManagementItem[]
    ) => ({
      payload: { initiative, items, skills, risks },
    }),
    initiativeUpdated: (initiative: Initiative) => ({
      payload: { initiative },
    }),
    initiativeCreated: (initiative: Initiative) => ({
      payload: { initiative },
    }),
    setLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    save: (draft: boolean) => ({ payload: { draft } }),
    addNewItem: null,
    cancelAdd: null,
    setInitiativeId: initiativeId => ({ payload: { initiativeId } }),
    setWasCreated: (wasCreated: boolean) => ({ payload: { wasCreated } }),
    setSelectedTab: (selectedTab: string) => ({ payload: { selectedTab } }),
    edit: null,
    cancelEdit: null,
    skillCreated: (skill: Skill) => ({ payload: { skill } }),
  })
  .withState<InitiativesState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const InitiativesRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: ['/initiatives', '/initiatives/:id'],
  component: <InitiativesRoute />,
};

// --- Types ---
export interface InitiativesState {
  isLoaded: boolean;
  initiatives: Initiative[];
  isLoading: boolean;
  isSaving: boolean;
  selectedTab: string;
  isAdding: boolean;
  wasCreated: boolean;
  initiativeId: number | null;
  initiative: Initiative | null;
  items: InitiativeItemProgress[];
  isEditing: boolean;
  skills: Skill[];
  risks: RiskManagementItem[];
}
