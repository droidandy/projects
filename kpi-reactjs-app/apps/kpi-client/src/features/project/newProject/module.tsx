import React from 'react';
import * as Rx from 'src/rx';
import { GlobalActions } from '../../global/interface';
import {
  createInitiativeItem,
  updateInitiativeItem,
  login,
  setAccessToken,
  clearStorage,
  getLookups,
  getInitiativeOptions,
  createInitiativeItemUser,
  deleteInitiativeItemUser,
  createInitiativeItemPhase,
  updateInitiativeItemPhase,
  deleteInitiativeItemPhase,
  createProjectCommunicationPlan,
  updateProjectCommunicationPlan,
  deleteProjectCommunicationPlan,
  createProjectBudgetPlan,
  updateProjectBudgetPlan,
  deleteProjectBudgetPlan,
  createProjectOtherResource,
  updateProjectOtherResource,
  deleteProjectOtherResource,
  createProjectRisk,
  updateProjectRisk,
  deleteProjectRisk,
  createProjectChangeManagement,
  updateProjectChangeManagement,
  deleteProjectChangeManagement,
  submitProjectCharter,
} from '../shared/API';
import { NewProjectView } from './components/NewProjectView';
import {
  getNewProjectState,
  NewProjectActions,
  NewProjectState,
  handle,
} from './interface';

import {
  DetailsFormActions,
  getDetailsFormState,
} from './forms/details-form';

import {
  UserManagementFormActions,
  getUserManagementFormState,
} from './forms/user-management-form';

import {
  PhasesFormActions,
  getPhasesFormState,
} from './forms/phases-form';

import {
  ResourcesFormActions,
  getResourcesFormState,
} from './forms/resources-form';

import {
  RisksFormActions,
  getRisksFormState,
} from './forms/risks-form';

import {
  ChangeManagementFormActions,
  getChangeManagementFormState,
} from './forms/change-management-form';

import { 
  State,
  getLocalizedString,
  getInitiativeItems,
  ProjectPhaseType,
  SaveAction,
  getLookupsByCategory,
  ProjectResourceType,
} from './const';
// --- Epic ---

handle
  .epic()
  .on(NewProjectActions.$mounted, () => {
    clearStorage();
    return login('admin', 'admin').pipe(
      Rx.catchError(() => {
        clearStorage();
        return Rx.of(null);
      }),
      Rx.map( (response) => {
        if (!response) return Rx.of(null);
        setAccessToken(response.token);
        return NewProjectActions.load();
      })
    );
  })
  .on(NewProjectActions.load, () => {
    return Rx.forkJoin([
      getInitiativeOptions(),
      getLookups(),
    ]).pipe(
      Rx.map( ( [ options, lookups ] ) => {
        console.log(options);
        return NewProjectActions.loaded(options, lookups);
      })
    );
  })
  .on(DetailsFormActions.setSubmitSucceeded, () => {
    return NewProjectActions.setCurrentStep(State.UserManagement);
  })
  .on(UserManagementFormActions.setSubmitSucceeded, () => {
    return NewProjectActions.setCurrentStep(State.ProjectPhases);
  })
  .on(PhasesFormActions.setSubmitSucceeded, () => {
    return NewProjectActions.setCurrentStep(State.ProjectResources);
  })
  .on(ResourcesFormActions.setSubmitSucceeded, () => {
    return NewProjectActions.setCurrentStep(State.ProjectRisks);
  })
  .on(RisksFormActions.setSubmitSucceeded, () => {
    return NewProjectActions.setCurrentStep(State.ChangeManagement);
  })
  .on(ChangeManagementFormActions.setSubmitSucceeded, () => {
    return NewProjectActions.setCurrentStep(State.ReviewSubmit);
  })
  //Project Details
  .on(NewProjectActions.saveProjectDetails, () => {
    const projectId = getNewProjectState().projectId;
    if (projectId) {
      return updateInitiativeItem(projectId, getInitiativeItems()).pipe(
        Rx.map(response => {
          return NewProjectActions.projectDetailsSaved(response);
        })
      );
    }
    else {
      return createInitiativeItem(getInitiativeItems()).pipe(
        Rx.map(response => {
          return NewProjectActions.projectDetailsSaved(response);
        })
      );
    }
  })
  //User Management
  .on(NewProjectActions.addUserManagement, ({ value }) => {
    const projectId = getNewProjectState().projectId;
    if (projectId) {
      return createInitiativeItemUser(value).pipe(
        Rx.map(response => {
          return NewProjectActions.userManagementSaved();
        })
      );
    }
    throw console.error('error');
  })
  .on(NewProjectActions.deleteUserManagement, ({ value }) => {
    const projectId = getNewProjectState().projectId;
    if (projectId) {
      return deleteInitiativeItemUser(value).pipe(
        Rx.map(response => {
          return NewProjectActions.userManagementSaved();
        })
      );
    }
    throw console.error('error');
  })
  .on(NewProjectActions.saveUserManagement, () => {
    const projectId = getNewProjectState().projectId;
    if (projectId) {
      return NewProjectActions.userManagementSaved();
    }
    throw console.error('error');
  })
  //Project Phases
  .on(NewProjectActions.saveProjectPhases, ({ type, action, value, id }) => {
    let observable: Rx.Observable<any>;
    if (type === ProjectPhaseType.MainPhase) {
      switch (action) {
        case SaveAction.Create:
          observable = createInitiativeItemPhase(value);
          break;
        case SaveAction.Update:
          observable = updateInitiativeItemPhase(id, value);
          break;
        case SaveAction.Delete:
          observable = deleteInitiativeItemPhase(id);
          break;
        default:
          throw console.error('error');
      }
    }
    else {
      switch (action) {
        case SaveAction.Create:
          observable = createProjectCommunicationPlan({ ...value, type });
          break;
        case SaveAction.Update:
            observable = updateProjectCommunicationPlan(id, { ...value, type });
          break;
        case SaveAction.Delete:
            observable = deleteProjectCommunicationPlan(id);
          break;
        default:
          throw console.error('error');
      }
    }

    return observable.pipe(
      Rx.map(response => {
        return NewProjectActions.projectPhasesSaved(type, action, response, id);
      })
    );
  })
  //Project Resource
  .on(NewProjectActions.saveProjectResource, ({ type, action, value, id }) => {
    let observable: Rx.Observable<any>;
    if (type === ProjectResourceType.BudgetPlan) {
      switch (action) {
        case SaveAction.Create:
          observable = createProjectBudgetPlan(value);
          break;
        case SaveAction.Update:
          observable = updateProjectBudgetPlan(id, value);
          break;
        case SaveAction.Delete:
          observable = deleteProjectBudgetPlan(id);
          break;
        default:
          throw console.error('error');
      }
    }
    else {
      switch (action) {
        case SaveAction.Create:
          observable = createProjectOtherResource(value);
          break;
        case SaveAction.Update:
          observable = updateProjectOtherResource(id, value);
          break;
        case SaveAction.Delete:
          observable = deleteProjectOtherResource(id);
          break;
        default:
          throw console.error('error');
      }
    }
    
    return observable.pipe(
      Rx.map(response => {
        return NewProjectActions.projectResourceSaved(type, action, response, id);
      })
    );
  })
  //Project Risk
  .on(NewProjectActions.saveProjectRisk, ({ action, value, id }) => {
    console.log(value);
    let observable: Rx.Observable<any>;
    switch (action) {
      case SaveAction.Create:
        observable = createProjectRisk(value);
        break;
      case SaveAction.Update:
        observable = updateProjectRisk(id, value);
        break;
      case SaveAction.Delete:
        observable = deleteProjectRisk(id);
        break;
      default:
        throw console.error('error');
    }
    
    return observable.pipe(
      Rx.map(response => {
        return NewProjectActions.projectRiskSaved(action, response, id);
      })
    );
  })
  //Project Change Management
  .on(NewProjectActions.saveProjectChangeManagement, ({ action, value, id }) => {
    console.log(value);
    let observable: Rx.Observable<any>;
    switch (action) {
      case SaveAction.Create:
        observable = createProjectChangeManagement(value);
        break;
      case SaveAction.Update:
        observable = updateProjectChangeManagement(id, value);
        break;
      case SaveAction.Delete:
        observable = deleteProjectChangeManagement(id);
        break;
      default:
        throw console.error('error');
    }
    
    return observable.pipe(
      Rx.map(response => {
        return NewProjectActions.projectChangeManagementSaved(action, response, id);
      })
    );
  })
  //Common
  .on(NewProjectActions.cancel, () => {
    console.log('cancel');
    return NewProjectActions.setCurrentStep(State.ProjectDetails);
  })
  .on(NewProjectActions.submit, () => {
    const projectId = getNewProjectState().projectId;
    if (projectId) {
      return submitProjectCharter(projectId).pipe(
        Rx.map(response => {
          if (!(response as any).initiativeItemId) throw console.error('error');
          return NewProjectActions.setCurrentStep(State.ProjectDetails);
        })
      );
    }
    throw console.error('error');
  })
  .onMany([ 
    NewProjectActions.projectDetailsSaved, 
    NewProjectActions.userManagementSaved,
    NewProjectActions.projectPhasesSaved,
  ], () => {
    return  GlobalActions.showNotification(
      'success',
      'draft saved'
    );
  })
  .onMany([ 
    NewProjectActions.projectResourceSaved, 
    NewProjectActions.projectRiskSaved,
    NewProjectActions.projectChangeManagementSaved,
  ], () => {
    return  GlobalActions.showNotification(
      'success',
      'draft saved'
    );
  });

// --- Reducer ---
const initialState: NewProjectState = {
  currentStep: '',
  isLoading: true,
  projectId: null,
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
  lookups: [],
  options: {
    relProjectsOptions: [
      { label: 'Action', value: 'Action' },
      { label: 'Select Item', value: 'Select Item' },
    ],
    comChannelOptions: [],
    comFrequencyOptions: [],
    roleOptions: [],
    usersOptions: [],
    activityOptions: [],
    paymentOptions: [],
    resourceOptions: [],
    riskTypeOptions: [],
    probabilityOptions: [
      { label: '5', value: 5 },
      { label: '4', value: 4 },
      { label: '3', value: 3 },
      { label: '2', value: 2 },
      { label: '1', value: 1 },
      { label: '0', value: 0 },
    ],
    impactOptions: [
      { label: '5', value: 5 },
      { label: '4', value: 4 },
      { label: '3', value: 3 },
      { label: '2', value: 2 },
      { label: '1', value: 1 },
      { label: '0', value: 0 },
    ],
    counterMeasuresOptions: [],
    responsibilityOptions: [],
    changeScopeOptions: [],
    affectedPartiesOptions: [],
    requiredActionOptions: [],
  },
};

handle
  .reducer(initialState)
  .on(NewProjectActions.loaded, (state, { options, lookups }) => {
    state.currentStep = State.ProjectDetails;
    state.options.usersOptions = options.orgUsers.map( (item) => {
      return {
        label: getLocalizedString(item.organization) + ' - ' + item.username, 
        value: item.id,
      }
    } );

    state.options.roleOptions = options.roles.map( (item) => {
      return {
        label: getLocalizedString(item.role),
        value: item.id
      }
    } );

    state.lookups = lookups;
    state.options.comChannelOptions = getLookupsByCategory(lookups, 'CommunicationChannel');
    state.options.comFrequencyOptions = getLookupsByCategory(lookups, 'Frequency');
    state.options.activityOptions = getLookupsByCategory(lookups, 'ActivityType');
    state.options.paymentOptions = getLookupsByCategory(lookups, 'PaymentType');
    state.options.resourceOptions = getLookupsByCategory(lookups, 'ResourceType');
    state.options.riskTypeOptions = getLookupsByCategory(lookups, 'RiskType');
    state.options.responsibilityOptions = getLookupsByCategory(lookups, 'ResponsibilityType');
    state.options.counterMeasuresOptions = getLookupsByCategory(lookups, 'CounterMeasureType');
    state.options.changeScopeOptions = getLookupsByCategory(lookups, 'ChangeScopeType');
    state.options.affectedPartiesOptions = getLookupsByCategory(lookups, 'AffectedPartiesType');
    state.options.requiredActionOptions = getLookupsByCategory(lookups, 'RequiredActionType');
  })
  .on(NewProjectActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(NewProjectActions.setCurrentStep, (state, { currentStep }) => {
    if (state.currentStep === currentStep) {
      return;
    }
    
    if (state.currentStep === State.ProjectPhases && currentStep === State.ProjectResources) {
      const { values } = getPhasesFormState();
      state.projectPhases = {...values};
    }

    if (state.currentStep === State.ProjectResources && currentStep === State.ProjectRisks) {
      const { values } = getResourcesFormState();
      state.projectResources = {...values};
    }

    if (state.currentStep === State.ProjectRisks && currentStep === State.ChangeManagement) {
      const { values } = getRisksFormState();
      state.projectRisks = {...values};
    }

    if (state.currentStep === State.ChangeManagement && currentStep === State.ReviewSubmit) {
      const { values } = getChangeManagementFormState();
      state.changeManagement = {...values};
    }
    
    state.currentStep = currentStep;
  })
  .on(NewProjectActions.projectDetailsSaved, (state, { initiativeItems }) => {
    state.projectId = initiativeItems.id;
    const { values } = getDetailsFormState();
    state.projectDetails = {
      ...state.projectDetails,
      ...values,
      name: getLocalizedString(initiativeItems.name),
      description: getLocalizedString(initiativeItems.description),
      budget: initiativeItems.budget.toString(),
      startDate: new Date(initiativeItems.startDate),
      endDate:new Date(initiativeItems.endDate),
      state: initiativeItems.innovativeFactor ? initiativeItems.innovativeFactor : '',
    };
  })
  .on(NewProjectActions.userManagementSaved, (state) => {
    const { values } = getUserManagementFormState();
    state.userManagement = {...values};
  })
  .on(NewProjectActions.projectPhasesSaved, (state, {type, action, value, id}) => {
    const { values } = getPhasesFormState();
    state.projectPhases = {...values};
    if (type === ProjectPhaseType.MainPhase) {
      switch (action) {
        case SaveAction.Create:
          {
            state.projectPhases.mainPhases.push({
              id: value.id,
              name: getLocalizedString(value.name),
              startDate: new Date(value.startDate),
              endDate: new Date(value.endDate),
              outcome: value.outcome,
              comment: value.comment,
            });
            break;
          }
        case SaveAction.Update:
          {
            const index = state.projectPhases.mainPhases.findIndex( (item) => { return item.id === id; } );
            state.projectPhases.mainPhases[index]= {
              id: value.id,
              name: getLocalizedString(value.name),
              startDate: new Date(value.startDate),
              endDate: new Date(value.endDate),
              outcome: value.outcome,
              comment: value.comment,
            }
            break;
          }
        case SaveAction.Delete:
          {
            const index = state.projectPhases.mainPhases.findIndex( (item) => { return item.id === id; } );
            state.projectPhases.mainPhases.splice(index, 1);
            break;
          }
      }
    }
    else {
      let communication;
      if (type === ProjectPhaseType.ProjectSetup) communication = state.projectPhases.communication.setup;
      else if (type === ProjectPhaseType.ProjectDuring) communication = state.projectPhases.communication.during;
      else if (type === ProjectPhaseType.ProjectPost) communication = state.projectPhases.communication.post;
      else return;
      
      switch (action) {
        case SaveAction.Create:
          {
            const channel = state.options.comChannelOptions.find( (item) => { return item.value === value.communicationChannelId; });
            const frequency = state.options.comFrequencyOptions.find( (item) => { return item.value === value.frequencyId; });
            communication.push({
              id: value.id,
              message: value.message,
              audience: value.targetAudience,
              channel,
              frequency,
              efficiency: value.efficiency,
            });
            break;
          }
        case SaveAction.Update:
          {
            const channel = state.options.comChannelOptions.find( (item) => { return item.value === value.communicationChannelId; });
            const frequency = state.options.comFrequencyOptions.find( (item) => { return item.value === value.frequencyId; });
            const index = communication.findIndex( (item) => { return item.id === id; } );
            communication[index]= {
              id: value.id,
              message: value.message,
              audience: value.targetAudience,
              channel,
              frequency,
              efficiency: value.efficiency,
            }
            break;
          }
        case SaveAction.Delete:
          {
            const index = communication.findIndex( (item) => { return item.id === id; } );
            communication.splice(index, 1);
            break;
          }
      }

      if (type === ProjectPhaseType.ProjectSetup) state.projectPhases.communication.setup = communication;
      else if (type === ProjectPhaseType.ProjectDuring) state.projectPhases.communication.during = communication;
      else if (type === ProjectPhaseType.ProjectPost) state.projectPhases.communication.post = communication;
    }
  })
  .on(NewProjectActions.projectResourceSaved, (state, {type, action, value, id}) => {
    const { values } = getResourcesFormState();
    state.projectResources = {...values};
    if (type === ProjectResourceType.BudgetPlan) {
      switch (action) {
        case SaveAction.Create:
          {
            const activity = state.options.activityOptions.find( (item) => { return item.value === value.typeId; });
            const payment = state.options.paymentOptions.find( (item) => { return item.value === value.paymentProcedureId; });
            state.projectResources.budgetPlans.push({
              id: value.id,
              activity,
              details: value.details,
              financialItem: getLocalizedString(value.financialItem),
              mainBudget: value.mainBudget,
              extraCost: value.extraCost,
              totalCost: value.totalCost,
              paymentProc: payment,
              timeline: [new Date(value.startDate), new Date(value.endDate)],
              comment: value.comment,
            });
            break;
          }
        case SaveAction.Update:
          {
            const activity = state.options.activityOptions.find( (item) => { return item.value === value.typeId; });
            const payment = state.options.paymentOptions.find( (item) => { return item.value === value.paymentProcedureId; });
            const index = state.projectResources.budgetPlans.findIndex( (item) => { return item.id === id; } );
            state.projectResources.budgetPlans[index]= {
              id: value.id,
              activity,
              details: value.details,
              financialItem: getLocalizedString(value.financialItem),
              mainBudget: value.mainBudget,
              extraCost: value.extraCost,
              totalCost: value.totalCost,
              paymentProc: payment,
              timeline: [new Date(value.startDate), new Date(value.endDate)],
              comment: value.comment,
            }
            break;
          }
        case SaveAction.Delete:
          {
            const index = state.projectResources.budgetPlans.findIndex( (item) => { return item.id === id; } );
            state.projectResources.budgetPlans.splice(index, 1);
            break;
          }
      }
    }
    else {
      switch (action) {
        case SaveAction.Create:
          {
            const activity = state.options.activityOptions.find( (item) => { return item.value === value.typeId; });
            const resource = state.options.resourceOptions.find( (item) => { return item.value === value.resourceId; });
            state.projectResources.otherResources.push({
              id: value.id,
              activity,
              resource,
              details: value.details,
              mainBudget: value.mainBudget,
              comment: value.comment,
            });
            break;
          }
        case SaveAction.Update:
          {
            const activity = state.options.activityOptions.find( (item) => { return item.value === value.typeId; });
            const resource = state.options.resourceOptions.find( (item) => { return item.value === value.resourceId; });
            const index = state.projectResources.otherResources.findIndex( (item) => { return item.id === id; } );
            state.projectResources.otherResources[index]= {
              id: value.id,
              activity,
              resource,
              details: value.details,
              mainBudget: value.mainBudget,
              comment: value.comment,
            }
            break;
          }
        case SaveAction.Delete:
          {
            const index = state.projectResources.otherResources.findIndex( (item) => { return item.id === id; } );
            state.projectResources.otherResources.splice(index, 1);
            break;
          }
      }
    }
  })
  .on(NewProjectActions.projectRiskSaved, (state, {action, value, id}) => {
    const { values } = getRisksFormState();
    state.projectRisks = {...values};
    switch (action) {
      case SaveAction.Create:
        {
          const activity = state.options.activityOptions.find( 
            (item) => { return item.value === value.typeId; }
          );
          const riskType = state.options.riskTypeOptions.find( 
            (item) => { return item.value === value.riskTypeId; }
          );
          const probability = state.options.probabilityOptions.find( 
            (item) => { return item.value === value.probability; }
          );
          const impact = state.options.impactOptions.find( 
            (item) => { return item.value === value.impact; }
          );
          const responsibility = state.options.responsibilityOptions.find( 
            (item) => { return item.value === value.responsibilityId; }
          );
          const counterMeasures = state.options.counterMeasuresOptions.filter( 
            (item) => { return -1 !== (value.counterMeasures as []).findIndex( 
              subitem => {
                return subitem === item.value;
              }
            )}
          );

          if (!probability || !impact) throw console.error('error');

          state.projectRisks.risks.push({
            id: value.id,
            activity,
            type: riskType,
            description: getLocalizedString(value.description),
            probability,
            impact,
            counterMeasures,
            responsibility,
            timeline: [new Date(value.startDate), new Date(value.endDate)],
          });
          break;
        }
      case SaveAction.Update:
        {
          const activity = state.options.activityOptions.find( 
            (item) => { return item.value === value.typeId; }
          );
          const riskType = state.options.riskTypeOptions.find( 
            (item) => { return item.value === value.riskTypeId; }
          );
          const probability = state.options.probabilityOptions.find( 
            (item) => { return item.value === value.probability; }
          );
          const impact = state.options.impactOptions.find( 
            (item) => { return item.value === value.impact; }
          );
          const responsibility = state.options.responsibilityOptions.find( 
            (item) => { return item.value === value.responsibilityId; }
          );
          const counterMeasures = state.options.counterMeasuresOptions.filter( 
            (item) => { return -1 !== (value.counterMeasures as []).findIndex( 
              subitem => {
                return subitem === item.value;
              }
            )}
          );
          
          if (!probability || !impact) throw console.error('error');

          const index = state.projectRisks.risks.findIndex( (item) => { return item.id === id; } );
          state.projectRisks.risks[index]= {
            id: value.id,
            activity,
            type: riskType,
            description: getLocalizedString(value.description),
            probability,
            impact,
            counterMeasures,
            responsibility,
            timeline: [new Date(value.startDate), new Date(value.endDate)],
          }
          break;
        }
      case SaveAction.Delete:
        {
          const index = state.projectRisks.risks.findIndex( (item) => { return item.id === id; } );
          state.projectRisks.risks.splice(index, 1);
          break;
        }
    }
  })
  .on(NewProjectActions.projectChangeManagementSaved, (state, {action, value, id}) => {
    const { values } = getChangeManagementFormState();
    state.changeManagement = {...values};
    switch (action) {
      case SaveAction.Create:
        {
          const changeScope = state.options.changeScopeOptions.find( 
            (item) => { return item.value === value.changeScopeId; }
          );
          const affectedParties = state.options.affectedPartiesOptions.find( 
            (item) => { return item.value === value.affectedPartiesId; }
          );
          const requiredAction = state.options.requiredActionOptions.filter( 
            (item) => { return -1 !== (value.requiredAction as []).findIndex( 
              subitem => {
                return subitem === item.value;
              }
            )}
          );
          state.changeManagement.changeManagements.push({
            id: value.id,
            needForChange: getLocalizedString(value.needForChange),
            description: getLocalizedString(value.description),
            changeScope,
            affectedParties,
            requiredAction,
            timeline: [new Date(value.startDate), new Date(value.endDate)],
          });
          break;
        }
      case SaveAction.Update:
        {
          const changeScope = state.options.changeScopeOptions.find( 
            (item) => { return item.value === value.changeScopeId; }
          );
          const affectedParties = state.options.affectedPartiesOptions.find( 
            (item) => { return item.value === value.affectedPartiesId; }
          );
          const requiredAction = state.options.requiredActionOptions.filter( 
            (item) => { return -1 !== (value.requiredAction as []).findIndex( 
              subitem => {
                return subitem === item.value;
              }
            )}
          );
          const index = state.changeManagement.changeManagements.findIndex( (item) => { return item.id === id; } );
          state.changeManagement.changeManagements[index]= {
            id: value.id,
            needForChange: getLocalizedString(value.needForChange),
            description: getLocalizedString(value.description),
            changeScope,
            affectedParties,
            requiredAction,
            timeline: [new Date(value.startDate), new Date(value.endDate)],
          }
          break;
        }
      case SaveAction.Delete:
        {
          const index = state.changeManagement.changeManagements.findIndex( (item) => { return item.id === id; } );
          state.changeManagement.changeManagements.splice(index, 1);
          break;
        }
    }
  });

  
// --- Module ---
export default () => {
  handle();
  return <NewProjectView />;
};
