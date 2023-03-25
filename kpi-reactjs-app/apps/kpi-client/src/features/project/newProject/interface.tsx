import React from 'react';
import { createModule } from 'typeless';
import { RouteConfig, SelectOption } from 'src/types';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { NewProjectSymbol } from './symbol';
import { ProjectDetailsFormValues } from './forms/details-form';
import { UserManagementFormValues } from './forms/user-management-form';
import { ProjectPhasesFromValues } from './forms/phases-form';
import { ProjectResourcesFormValues } from './forms/resources-form';
import { ProjectRisksFormValues } from './forms/risks-form';
import { ChangeManagementFormValues } from './forms/change-management-form';
import { 
  InitiativeItems, 
  InitiativeOptions, 
  InitiativeItemUser, 
  Lookup, 
} from '../shared/type';
import { 
  ProjectPhaseType, 
  ProjectResourceType,
  SaveAction 
} from './const';

// --- Actions ---
export const [handle, NewProjectActions, getNewProjectState] = createModule(
  NewProjectSymbol
)
  .withActions({
    $mounted: null,
    load: null,
    cancel: () => ({}),
    submit: () => ({}),
    loaded: (options: InitiativeOptions, lookups: Lookup[]) => ({ payload: { options, lookups } }),
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    setCurrentStep: (currentStep: string) => ({ payload: { currentStep } }),
    saveProjectDetails: () => ({}),
    projectDetailsSaved: (initiativeItems: InitiativeItems) => ({ payload: { initiativeItems } }),
    saveUserManagement: () => ({}),
    addUserManagement: (value: InitiativeItemUser) => ({ payload: {value } }),
    deleteUserManagement: (value: InitiativeItemUser) => ({ payload: {value } }),
    userManagementSaved: () => ({ }),
    saveProjectPhases: (type: ProjectPhaseType, action: SaveAction, value: any, id: number) => ({ payload: {type, action, value, id} }),
    projectPhasesSaved: (type: ProjectPhaseType, action: SaveAction, value: any, id: number) => ({ payload: {type, action, value, id} }),
    saveProjectResource: (type: ProjectResourceType, action: SaveAction, value: any, id: number) => ({ payload: {type, action, value, id} }),
    projectResourceSaved: (type: ProjectResourceType, action: SaveAction, value: any, id: number) => ({ payload: {type, action, value, id} }),
    saveProjectRisk: (action: SaveAction, value: any, id: number) => ({ payload: {action, value, id} }),
    projectRiskSaved: (action: SaveAction, value: any, id: number) => ({ payload: {action, value, id} }),
    saveProjectChangeManagement: (action: SaveAction, value: any, id: number) => ({ payload: {action, value, id} }),
    projectChangeManagementSaved: (action: SaveAction, value: any, id: number) => ({ payload: {action, value, id} }),
  })
  .withState<NewProjectState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const NewProjectRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/projects/new',
  component: <NewProjectRoute />,
};

// --- Types ---
export interface NewProjectState {
  currentStep: string;
  isLoading: boolean;
  projectId: number | null;
  projectDetails: ProjectDetailsFormValues;
  userManagement: UserManagementFormValues;
  projectPhases: ProjectPhasesFromValues;
  projectResources: ProjectResourcesFormValues;
  projectRisks: ProjectRisksFormValues;
  changeManagement: ChangeManagementFormValues;
  lookups: Lookup[];
  options: {
    relProjectsOptions: SelectOption[];
    comChannelOptions: SelectOption[];
    comFrequencyOptions: SelectOption[];
    roleOptions: SelectOption[];
    usersOptions: SelectOption[];
    activityOptions: SelectOption[];
    paymentOptions: SelectOption[];
    resourceOptions: SelectOption[];
    riskTypeOptions: SelectOption[];
    probabilityOptions: SelectOption[];
    impactOptions: SelectOption[];
    counterMeasuresOptions: SelectOption[];
    responsibilityOptions: SelectOption[];
    changeScopeOptions: SelectOption[];
    affectedPartiesOptions: SelectOption[];
    requiredActionOptions: SelectOption[];
  };
}