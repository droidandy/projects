import React from 'react';
import * as R from 'remeda';
import * as Rx from 'src/rx';
import { RouterActions, getRouterState } from 'typeless-router';
import {
  login,
  clearStorage,
  setAccessToken,
  getProjectCharter,
  rejectProjectCharter,
  approveProjectCharter,
} from '../shared/API';
import { ProjectReview } from './components/ProjectReview';
import {
  getProjectReviewState,
  ProjectReviewAction,
  ProjectReviewState,
  handle,
} from './interface';
// --- Epic ---

handle
  .epic()
  .on(ProjectReviewAction.$mounted, () => {
    clearStorage();
    return login('admin', 'admin').pipe(
      Rx.catchError(() => {
        clearStorage();
        return Rx.of(null);
      }),
      Rx.map( (response) => {
        if (!response) return Rx.of(null);
        setAccessToken(response.token);
        return ProjectReviewAction.load();
      })
    );
  })
  .on(ProjectReviewAction.load, () => {
    const { pathname } = getRouterState().location!;
    const id = Number(R.last(pathname.split('/')));
    return getProjectCharter(id).pipe(
      Rx.catchError(() => {
        clearStorage();
        return Rx.of(null);
      }),
      Rx.map( (response) => {
        return ProjectReviewAction.loaded(id, response);
      })
    );
  })
  .on(ProjectReviewAction.goBack, () => {
    console.log('return');
    return RouterActions.push(`/projects/listing`);
  })
  .on(ProjectReviewAction.approve, () => {
    const projectId = getProjectReviewState().projectId;
    const comment = getProjectReviewState().review;
    if (projectId) {
      return approveProjectCharter(projectId, {comment: comment ? comment : null}).pipe(
        Rx.map((response: any) => {
          if (response.success) {
            return RouterActions.push(`/projects/listing`);
          }
          throw console.error(response.err);
        })
      );
    }
    throw console.error('error');
  })
  .on(ProjectReviewAction.reject, () => {
    const projectId = getProjectReviewState().projectId;
    const comment = getProjectReviewState().review;
    if (projectId) {
      return rejectProjectCharter(projectId, {comment: comment ? comment : null}).pipe(
        Rx.map((response: any) => {
          if (response.success) {
            return RouterActions.push(`/projects/listing`);
          }
          throw console.error(response.err);
        })
      );
    }
    throw console.error('error');
  });

// --- Reducer ---
const initialState: ProjectReviewState = {
  currentStep: '',
  isLoading: true,
  projectId: -1,
  project: {
    projectDetails: {
      name: '',
      description: '',
      budget: '',
      startDate: new Date(),
      endDate: new Date(),
      objectives: [],
      specs: [],
      challenges: [],
      state: '',
      relProjects: [],
    },
    userManagement: {
      owner: '',
      manager: '',
      members: [],
    },
    projectPhases: {
      mainPhases : [],
      communication : {
        setup: [],
        during: [],
        post: [],
      }
    },
    projectResources: {
      budgetPlans: [],
      otherResources: [],
    },
    projectRisks: {
      risks: [],
    },
    changeManagement: {
      changeManagements: [],
    },
  },
  review: ''
};

handle
  .reducer(initialState)
  .on(ProjectReviewAction.loaded, (state, { id, initiative }) => {
    state.projectId = id;
    state.project = {
      ...state.project,
      ...initiative
    };
    console.log(state.project);
  })
  .on(ProjectReviewAction.changeReview, (state, { review }) => {
    state.review = review;
  })
  .on(ProjectReviewAction.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  });

  
// --- Module ---
export default () => {
  handle();
  return <ProjectReview />;
};
