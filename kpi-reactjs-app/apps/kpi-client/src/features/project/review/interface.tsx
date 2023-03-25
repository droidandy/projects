import React from 'react';
import { createModule } from 'typeless';
import { RouteConfig } from 'src/types';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { projectReviewSymbol } from './symbol';
import { 
  ProjectDetailsFormValues,
  UserManagementFormValues,
  ProjectPhasesFromValues,
  ProjectResourcesFormValues,
  ProjectRisksFormValues,
  ChangeManagementFormValues,
} from './const';

// --- Actions ---
export const [handle, ProjectReviewAction, getProjectReviewState] = createModule(
  projectReviewSymbol
)
  .withActions({
    $mounted: null,
    load: null,
    loaded: (id: number, initiative: any) => ({ payload: { id, initiative } }),
    changeReview: (review: string) => ({ payload: { review } }),
    approve: null,
    reject: null,
    goBack: null,
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
  })
  .withState<ProjectReviewState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ProjectReviewRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/projects/review/:id',
  component: <ProjectReviewRoute />,
};

// --- Types ---
export interface ProjectReviewState {
  currentStep: string;
  isLoading: boolean;
  projectId: number;
  project: {
    projectDetails: ProjectDetailsFormValues;
    userManagement: UserManagementFormValues;
    projectPhases: ProjectPhasesFromValues;
    projectResources: ProjectResourcesFormValues;
    projectRisks: ProjectRisksFormValues;
    changeManagement: ChangeManagementFormValues;
  }
  review: string;
}