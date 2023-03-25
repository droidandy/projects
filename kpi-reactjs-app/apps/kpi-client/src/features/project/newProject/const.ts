import { getDetailsFormState } from './forms/details-form';

import { Status, LocalizedString, Lookup } from '../shared/type';
import { SelectOption } from 'src/types';

export enum State {
  ProjectDetails = 'project-details',
  UserManagement = 'user-management',
  ProjectPhases = 'project-phases',
  ProjectResources = 'project-resources',
  ProjectRisks = 'project-risks',
  ChangeManagement = 'change-management',
  ReviewSubmit = 'review-submit',
}

export enum ProjectPhaseType {
  MainPhase = 0,
  ProjectSetup = 1,
  ProjectDuring = 2,
  ProjectPost = 3,
}
export enum ProjectResourceType {
  BudgetPlan = 1,
  OtherResource = 2,
}

export enum SaveAction {
  Create = 'Create',
  Delete = 'Delete',
  Update = 'Update',
}

export const getInitiativeItems = () => {
  const projectDetails = getDetailsFormState().values;
  return {
    name: {
      en: projectDetails.name ? projectDetails.name : null,
      ar: projectDetails.name ? projectDetails.name : null,
    },
    description: {
      en: projectDetails.description ? projectDetails.description : null,
      ar: projectDetails.description ? projectDetails.description : null,
    },
    code: null,
    projectCode: null,
    budget: parseFloat(projectDetails.budget)
      ? parseFloat(projectDetails.budget)
      : 0,
    currencyId: 15,
    startDate: projectDetails.startDate,
    endDate: projectDetails.endDate,
    unitId: 347,
    responsibleUnitId: 347,
    typeId: 19,
    innovativeFactor: projectDetails.state ? projectDetails.state : null,
    status: Status.Draft,
    statusColorId: 12,
  };
};

export const getLocalizedString = (value: LocalizedString): string => {
  const ret = value.en;
  return ret ? ret : '';
};

export const getLookupsByCategory = (
  lookups: Lookup[],
  category: string
): SelectOption<any>[] => {
  return lookups
    .filter(item => {
      return item.category === category;
    })
    .map(item => {
      return {
        label: item.ar,
        value: item.id,
      };
    });
};
