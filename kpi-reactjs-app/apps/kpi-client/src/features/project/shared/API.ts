import * as Rx from 'shared/rx';
import { User } from 'shared/types';
import {
  InitiativeItems,
  InitiativeItemUser,
  InitiativeItemPhase,
  ProjectCommunicationPlan,
  ProjectBudgetPlan,
  ProjectOtherResource,
  InitiativeOptions,
  InitiativeFilters,
  InitiativeSearchResult,
  Lookup,
  ProjectRisk,
  ProjectChangeManagement,
} from './type';

const API_NODE_BASE_URL = process.env.API_NODE_BASE_URL;
export const getAccessToken = () => {
  return localStorage.getItem('nodeToken');
};

export const setAccessToken = (token: string) => {
  localStorage.setItem('nodeToken', token);
};

export const clearStorage = () => {
  localStorage.removeItem('nodeToken');
};

const getHeaders = (fileUpload?: boolean) => {
  if (fileUpload) {
    return { Authorization: 'Bearer ' + getAccessToken() };
  }

  if (!getAccessToken()) {
    return {
      'Content-Type': 'application/json',
    };
  }

  return {
    Authorization: 'Bearer ' + getAccessToken(),
    'Content-Type': 'application/json',
  };
};

interface RequestOptions {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  body?: any;
  noApiPrefix?: boolean;
  fileUpload?: boolean;
}

function _makeRequest<T>(options: RequestOptions): Rx.Observable<T> {
  const { method, url, body, fileUpload } = options;
  return Rx.defer(() => {
    const fullUrl = API_NODE_BASE_URL + url;
    if (method === 'get' || method === 'delete') {
      return Rx.ajax[method](fullUrl, getHeaders(fileUpload));
    }
    return Rx.ajax[method](fullUrl, body, getHeaders(fileUpload));
  }).pipe(Rx.map(res => res.response as T));
}

export function login(username: string, password: string) {
  return _makeRequest<{ token: string; user: User }>({
    method: 'post',
    url: '/auth/login',
    body: { username: username, password },
  });
}

export function getLoggedUser() {
  return _makeRequest<{ user: User }>({
    method: 'get',
    url: '/user/me',
  });
}

export function createInitiativeItem(values: any) {
  return _makeRequest<InitiativeItems>({
    method: 'post',
    url: '/initiative-item',
    body: values,
  });
}

export function updateInitiativeItem(id: number, values: any) {
  return _makeRequest<InitiativeItems>({
    method: 'put',
    url: `/initiative-item/${id}`,
    body: values,
  });
}

export function getAllInitiativeItems() {
  return _makeRequest<InitiativeItems[]>({
    method: 'get',
    url: `/initiative-item`,
  });
}

export function getLookups() {
  return _makeRequest<Lookup[]>({
    method: 'get',
    url: `/lookups`,
  });
}

export function getInitiativeOptions() {
  return _makeRequest<InitiativeOptions>({
    method: 'get',
    url: `/initiative/option`,
  });
}

export function createInitiativeItemUser(values: InitiativeItemUser) {
  return _makeRequest<InitiativeItemUser>({
    method: 'post',
    url: `/initiative-item-user`,
    body: values,
  });
}

export function deleteInitiativeItemUser(values: InitiativeItemUser) {
  return _makeRequest({
    method: 'post',
    url: `/initiative-item-user/delete`,
    body: values,
  });
}

export function getInitiativeFilters() {
  return _makeRequest<InitiativeFilters>({
    method: 'get',
    url: `/initiative/filter`,
  });
}

export function searchInitiative(values: any) {
  return _makeRequest<InitiativeSearchResult>({
    method: 'post',
    url: `/initiative/search`,
    body: values,
  });
}

export function createInitiativeItemPhase(value: any) {
  return _makeRequest<InitiativeItemPhase>({
    method: 'post',
    url: `/initiative-item-phase`,
    body: value,
  });
}

export function updateInitiativeItemPhase(id: number, value: any) {
  return _makeRequest<InitiativeItemPhase>({
    method: 'put',
    url: `/initiative-item-phase/${id}`,
    body: value,
  });
}

export function deleteInitiativeItemPhase(id: number) {
  return _makeRequest({
    method: 'delete',
    url: `/initiative-item-phase/${id}`,
  });
}

export function createProjectCommunicationPlan(value: any) {
  return _makeRequest<ProjectCommunicationPlan>({
    method: 'post',
    url: `/communication-plan`,
    body: value,
  });
}

export function updateProjectCommunicationPlan(id: number, value: any) {
  return _makeRequest<ProjectCommunicationPlan>({
    method: 'put',
    url: `/communication-plan/${id}`,
    body: value,
  });
}

export function deleteProjectCommunicationPlan(id: number) {
  return _makeRequest({
    method: 'delete',
    url: `/communication-plan/${id}`,
  });
}

export function createProjectBudgetPlan(value: any) {
  return _makeRequest<ProjectBudgetPlan>({
    method: 'post',
    url: `/project-budget-plan`,
    body: value,
  });
}

export function updateProjectBudgetPlan(id: number, value: any) {
  return _makeRequest<ProjectBudgetPlan>({
    method: 'put',
    url: `/project-budget-plan/${id}`,
    body: value,
  });
}

export function deleteProjectBudgetPlan(id: number) {
  return _makeRequest({
    method: 'delete',
    url: `/project-budget-plan/${id}`,
  });
}

export function createProjectOtherResource(value: any) {
  return _makeRequest<ProjectOtherResource>({
    method: 'post',
    url: `/project-other-resource`,
    body: value,
  });
}

export function updateProjectOtherResource(id: number, value: any) {
  return _makeRequest<ProjectOtherResource>({
    method: 'put',
    url: `/project-other-resource/${id}`,
    body: value,
  });
}

export function deleteProjectOtherResource(id: number) {
  return _makeRequest({
    method: 'delete',
    url: `/project-other-resource/${id}`,
  });
}

export function createProjectRisk(value: any) {
  return _makeRequest<ProjectRisk>({
    method: 'post',
    url: `/project-risk`,
    body: value,
  });
}

export function updateProjectRisk(id: number, value: any) {
  return _makeRequest<ProjectRisk>({
    method: 'put',
    url: `/project-risk/${id}`,
    body: value,
  });
}

export function deleteProjectRisk(id: number) {
  return _makeRequest({
    method: 'delete',
    url: `/project-risk/${id}`,
  });
}

export function createProjectChangeManagement(value: any) {
  return _makeRequest<ProjectChangeManagement>({
    method: 'post',
    url: `/project-change-management`,
    body: value,
  });
}

export function updateProjectChangeManagement(id: number, value: any) {
  return _makeRequest<ProjectChangeManagement>({
    method: 'put',
    url: `/project-change-management/${id}`,
    body: value,
  });
}

export function deleteProjectChangeManagement(id: number) {
  return _makeRequest({
    method: 'delete',
    url: `/project-change-management/${id}`,
  });
}

export function getProjectCharter(id: number) {
  return _makeRequest({
    method: 'get',
    url: `/project-charter/${id}`,
  });
}

export function submitProjectCharter(id: number) {
  return _makeRequest({
    method: 'post',
    url: `/workflow/submit/${id}`,
  });
}

export function rejectProjectCharter(id: number, value: any) {
  return _makeRequest({
    method: 'post',
    url: `/workflow/reject/${id}`,
    body: value,
  });
}

export function approveProjectCharter(id: number, value: any) {
  return _makeRequest({
    method: 'post',
    url: `/workflow/approve-charter/${id}`,
    body: value,
  });
}