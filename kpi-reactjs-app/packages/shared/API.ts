import * as Rx from './rx';
import { getAccessToken } from './Storage';
import {
  User,
  OrganizationUnit,
  StrategicPlan,
  BalancedScorecard,
  Link,
  GenericItem,
  Goal,
  Kpi,
  Objective,
  Operation,
  Lookup,
  Role,
  KPILevel,
  Initiative,
  InitiativeItemProgress,
  ObjectPerformance,
  PeriodFrequency,
  KpiMeasure,
  RelatedItem,
  KpiDataSeriesPerformance,
  MofaGoal,
  Enabler,
  Outcome,
  Theme,
  ExcellenceCriteria,
  BalancedScorecardItemType,
  DevelopmentGoal,
  Skill,
  ExcellenceRequirement,
  Task,
  Challenge,
  Resource,
  ChallengeAction,
  InitiativeSkill,
  StrategicMap,
  RiskManagementItem,
  DataSeries,
  ReportingCycle,
  Organization,
  ExtendedInitiativeUpdate,
  ExcellenceTheme,
  UnitReport,
  KpiReportComment,
  UnitReportComment,
  ExcellenceReport,
  KPIReport,
  ExcellenceReportItemComment,
  Permission,
  OrgUser,
  FileDocument,
  ExcellenceEvidence,
  ReportValidation,
  Setting,
  Dashboard,
  ListResult,
  ReportStats,
  UserKpiReport,
  Comment,
  OrganizationUnitUser,
  MyKpiMeasureItem,
  KPISeriesReport,
  ScorecardStats,
  BalancedScorecardItemAllowedParent,
  KPISeriesReportValidationItem,
  KPISeriesReportValidation,
} from './types';
import { UnreachableCaseError, stringifyQueryString } from './helper';

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not set');
}

export { API_BASE_URL };

const getHeaders = (fileUpload?: boolean) => {
  if (fileUpload) {
    return { Authorization: 'Bearer ' + getAccessToken() };
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

export interface SearchResult<T> {
  metadata: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
  items: T[];
}

function _makeRequest<T>(options: RequestOptions): Rx.Observable<T> {
  const { method, url, body, noApiPrefix, fileUpload } = options;
  return Rx.defer(() => {
    const fullUrl = API_BASE_URL + (noApiPrefix ? '' : '/api') + url;
    if (method === 'get' || method === 'delete') {
      return Rx.ajax[method](fullUrl, getHeaders(fileUpload));
    }
    return Rx.ajax[method](fullUrl, body, getHeaders(fileUpload));
  }).pipe(Rx.map(res => res.response as T));
}

function createCRUD<T>(name: string, noRefetch = false) {
  const getById = (id: number) =>
    _makeRequest<T>({
      method: 'get',
      url: `/${name}/${id}`,
    });
  return [
    getById,
    (values: any) =>
      _makeRequest<number>({
        method: 'post',
        url: `/${name}`,
        body: values,
      }).pipe(
        Rx.mergeMap(id => {
          if (noRefetch) {
            return Rx.of((id as any) as T);
          }
          return getById(id);
        })
      ),
    (id: number, values: any) =>
      _makeRequest<number>({
        method: 'put',
        url: `/${name}/${id}`,
        body: values,
      }).pipe(Rx.mergeMap(() => getById(id))),
    (id: number) =>
      _makeRequest<any>({
        method: 'delete',
        url: `/${name}/${id}`,
      }),
    (criteria: any) =>
      _makeRequest<SearchResult<T>>({
        method: 'post',
        url: `/${name}/search`,
        body: criteria,
      }),
    () =>
      _makeRequest<T[]>({
        method: 'get',
        url: `/${name}`,
      }),
  ] as const;
}

export function login(username: string, password: string) {
  return _makeRequest<{ token: string; user: User }>({
    method: 'post',
    url: '/Auth/login',
    body: { login: username, password },
  });
}

export function getLoggedUser() {
  const token = getAccessToken()!;
  const encoded = token.split('.')[1];
  const data = JSON.parse(atob(encoded));
  const idKey =
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata';
  return _makeRequest<User>({
    method: 'get',
    url: '/User/' + data[idKey],
  });
}

export function getAllOrganizationUnit(organizationId: number) {
  return _makeRequest<SearchResult<OrganizationUnit>>({
    method: 'post',
    url: '/OrganizationUnit/search',
    body: { pageSize: 1e6, organizationId },
  }).pipe(Rx.map(ret => ret.items));
}

export function searchOrganizationUnit(criteria: any) {
  return _makeRequest<SearchResult<OrganizationUnit>>({
    method: 'post',
    url: '/OrganizationUnit/search',
    body: criteria,
  });
}

export function getAllStrategicPlans() {
  return _makeRequest<StrategicPlan[]>({
    method: 'get',
    url: '/StrategicPlan',
  });
}

export function getScorecard(strategicPlanId: number, unitId: number) {
  return _makeRequest<SearchResult<BalancedScorecard>>({
    method: 'post',
    url: '/Scorecard/search',
    body: { pageSize: 1, strategicPlanId, unitId },
  }).pipe(
    Rx.mergeMap(ret => {
      const scorecard = ret.items[0];
      return scorecard ? getScorecardById(scorecard.id) : Rx.of(null);
    })
  );
}
export function getAllScorecards(strategicPlanId: number) {
  return _makeRequest<SearchResult<BalancedScorecard>>({
    method: 'post',
    url: '/Scorecard/search',
    body: { pageSize: 1e7, strategicPlanId },
  }).pipe(
    Rx.mergeMap(ret =>
      Rx.from(ret.items.map(x => x.id)).pipe(
        Rx.mergeMap(id => getScorecardById(id)),
        Rx.toArray()
      )
    )
  );
}

export function getScorecardById(id: number, queryParams = {}) {
  return _makeRequest<BalancedScorecard>({
    method: 'get',
    url: `/Scorecard/${id}${stringifyQueryString(queryParams)}`,
  });
}

export function createScorecard(values: any) {
  return _makeRequest<number>({
    method: 'post',
    url: '/Scorecard',
    body: values,
  }).pipe(Rx.mergeMap(getScorecardById));
}

export function getOrganizationById(id: number | string) {
  return _makeRequest<Organization>({
    method: 'get',
    url: `/Organization/${id}`,
  });
}

export function getOrganizationUnitById(id: number) {
  return _makeRequest<OrganizationUnit>({
    method: 'get',
    url: `/OrganizationUnit/${id}`,
  });
}

export function getStrategicPlanById(id: number | string) {
  return _makeRequest<StrategicPlan>({
    method: 'get',
    url: `/StrategicPlan/${id}`,
  });
}

export function getLookups() {
  return _makeRequest<Lookup[]>({
    method: 'get',
    url: '/Lookup',
  });
}
export function getKPILevels() {
  return _makeRequest<KPILevel[]>({
    method: 'get',
    url: '/kpiLevel',
  });
}

export function createOrganizationUnit(values: any) {
  return _makeRequest<number>({
    method: 'post',
    url: `/OrganizationUnit`,
    body: values,
  }).pipe(Rx.mergeMap(id => getOrganizationUnitById(id)));
}

export function createStrategicPlan(values: any) {
  return _makeRequest<number>({
    method: 'post',
    url: `/StrategicPlan`,
    body: values,
  }).pipe(Rx.mergeMap(id => getStrategicPlanById(id)));
}

export function updateOrganizationUnit(id: number, values: any) {
  return _makeRequest<number>({
    method: 'put',
    url: `/OrganizationUnit/${id}`,
    body: values,
  }).pipe(Rx.mergeMap(() => getOrganizationUnitById(id)));
}

export function updateStrategicPlan(id: number, values: any) {
  return _makeRequest<number>({
    method: 'put',
    url: `/StrategicPlan/${id}`,
    body: values,
  }).pipe(Rx.mergeMap(() => getStrategicPlanById(id)));
}

export function deleteOrganizationUnit(id: number) {
  return _makeRequest<number>({
    method: 'delete',
    url: `/OrganizationUnit/${id}`,
  });
}

export function deleteStrategicPlan(id: number) {
  return _makeRequest<StrategicPlan>({
    method: 'delete',
    url: `/StrategicPlan/${id}`,
  });
}

export function searchStrategicPlans(criteria: any) {
  return _makeRequest<SearchResult<StrategicPlan>>({
    method: 'post',
    url: '/StrategicPlan/search',
    body: criteria,
  });
}
export function getInitiatives(
  strategicPlanId: number,
  unitId: number,
  criteria: any = {}
) {
  return _makeRequest<SearchResult<Initiative>>({
    method: 'post',
    url: `/InitiativeItem/search`,
    body: { pageSize: 1e6, strategicPlanId, unitId, ...criteria },
  }).pipe(Rx.map(ret => ret.items));
}

export function getInitiativeById(id: number) {
  return _makeRequest<Initiative>({
    method: 'get',
    url: `/InitiativeItem/${id}`,
  });
}

export function deleteInitiative(id: number) {
  return _makeRequest<any>({
    method: 'delete',
    url: `/InitiativeItem/${id}`,
  });
}

export function createInitiative(values: any) {
  return _makeRequest<number>({
    method: 'post',
    url: `/InitiativeItem`,
    body: values,
  }).pipe(Rx.mergeMap(id => getInitiativeById(id)));
}

export function createInitiativeExtended(values: any) {
  return _makeRequest<ExtendedInitiativeUpdate>({
    method: 'post',
    url: `/InitiativeItem/createExtended`,
    body: values,
  });
}
export function updateInitiativeExtended(id: number, values: any) {
  return _makeRequest<ExtendedInitiativeUpdate>({
    method: 'put',
    url: `/InitiativeItem/updateExtended/${id}`,
    body: values,
  });
}

export function updateInitiative(id: number, values: any) {
  return _makeRequest<number>({
    method: 'put',
    url: `/InitiativeItem/${id}`,
    body: values,
  }).pipe(Rx.mergeMap(() => getInitiativeById(id)));
}

export function getInitiativeItems(initiativeItemId: number) {
  return _makeRequest<SearchResult<InitiativeItemProgress>>({
    method: 'post',
    url: `/InitiativeItemProgress/search`,

    body: { pageSize: 1e6, initiativeItemId },
  }).pipe(Rx.map(ret => ret.items));
}

export function getAllInitiativeItems() {
  return _makeRequest<SearchResult<InitiativeItemProgress>>({
    method: 'post',
    url: `/InitiativeItemProgress/search`,

    body: { pageSize: 1e6 },
  }).pipe(Rx.map(ret => ret.items));
}

export function getInitiativeItemProgressById(id: number) {
  return _makeRequest<InitiativeItemProgress>({
    method: 'get',
    url: `/InitiativeItemProgress/${id}`,
  });
}

export function createInitiativeItemProgress(values: any) {
  return _makeRequest<number>({
    method: 'post',
    url: `/InitiativeItemProgress`,
    body: values,
  }).pipe(Rx.mergeMap(id => getInitiativeItemProgressById(id)));
}

export function updateInitiativeItemProgress(id: number, values: any) {
  return _makeRequest<number>({
    method: 'put',
    url: `/InitiativeItemProgress/${id}`,
    body: values,
  }).pipe(Rx.mergeMap(() => getInitiativeItemProgressById(id)));
}

export function updateDataSeriesPerformance(id: number, values: any) {
  return _makeRequest<ListResult<ObjectPerformance>>({
    method: 'put',
    url: `/KPIDataSeries/${id}`,
    body: {
      ...values,
      getPerformance: true,
    },
  }).pipe(Rx.map(ret => ret.items));
}
export function getDataSeriesById(id: number) {
  return _makeRequest<DataSeries>({
    method: 'get',
    url: `/KPIDataSeries/${id}`,
  });
}

export function createDataSeries(values: any) {
  return _makeRequest<number>({
    method: 'post',
    url: `/KPIDataSeries`,
    body: values,
  });
}

export function updateDataSeries(id: number, values: any) {
  return _makeRequest<number>({
    method: 'put',
    url: `/KPIDataSeries/${id}`,
    body: values,
  });
}

export function deleteDataSeries(id: number) {
  return _makeRequest<any>({
    method: 'delete',
    url: `/KPIDataSeries/${id}`,
  });
}

export interface ObjectPerformanceValues {
  historyCount?: number;
  balancedScorecardId?: number;
  objectId?: number;
  year?: number;
  periodNumber?: number;
  periodAggregation?: PeriodFrequency;
  isAggregated?: boolean;
}

export function getObjectPerformance(values: ObjectPerformanceValues) {
  return _makeRequest<SearchResult<ObjectPerformance>>({
    method: 'post',
    url: `/objectPerformanceSeries/search`,

    body: { pageSize: 1e6, ...values },
  }).pipe(Rx.map(ret => ret.items));
}

export function getObjectPerformanceMeasures(values: ObjectPerformanceValues) {
  return _makeRequest<SearchResult<KpiMeasure>>({
    method: 'post',
    url: `/objectPerformanceSeries/measures/search`,

    body: { pageSize: 1e6, ...values },
  }).pipe(Rx.map(ret => ret.items));
}

export function getRelatedItems(fromObjectType: string, fromObjectId: number) {
  return _makeRequest<SearchResult<RelatedItem>>({
    method: 'post',
    url: `/RelatedItem/search`,

    body: { pageSize: 1e6, fromObjectType, fromObjectId },
  }).pipe(Rx.map(ret => ret.items));
}

export function getRelatedItemById(id: number) {
  return _makeRequest<RelatedItem>({
    method: 'get',
    url: `/RelatedItem/${id}`,
  });
}

export function deleteRelatedItem(id: number) {
  return _makeRequest<any>({
    method: 'delete',
    url: `/RelatedItem/${id}`,
  });
}

export function createRelatedItem(values: any) {
  return _makeRequest<RelatedItem>({
    method: 'post',
    url: `/RelatedItem`,
    body: values,
  });
}

export interface KPIPerformanceValues {
  kpiId: number;
  year?: number;
  periodNumber?: number;
  periodAggregation?: PeriodFrequency;
  isAggregated?: boolean;
}

export function getKPIPerformance(values: KPIPerformanceValues) {
  return _makeRequest<SearchResult<KpiDataSeriesPerformance>>({
    method: 'post',
    url: `/KPIDataSeries/performance/search`,
    body: { pageSize: 1e6, ...values },
  }).pipe(Rx.map(ret => ret.items));
}

export function createSiteSetting(values: any) {
  return _makeRequest<Setting>({
    method: 'post',
    url: '/settings',
    body: values,
  });
}

// Scorecard items
export const [
  getKpi,
  createKpi,
  updateKpi,
  deleteKpi,
  searchKpi,
  getAllKpi,
] = createCRUD<Kpi>('KPI');
export const [
  getDevelopmentGoal,
  createDevelopmentGoal,
  updateDevelopmentGoal,
  deleteDevelopmentGoal,
  searchDevelopmentGoal,
  getAllDevelopmentGoal,
] = createCRUD<DevelopmentGoal>('goal');
export const [
  getMofaGoal,
  createMofaGoal,
  updateMofaGoal,
  deleteMofaGoal,
  searchMofaGoal,
  getAllMofaGoal,
] = createCRUD<MofaGoal>('goal');
export const [
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  searchGoal,
  getAllGoal,
  ,
] = createCRUD<Goal>('goal');
export const [
  getEnabler,
  createEnabler,
  updateEnabler,
  deleteEnabler,
  searchEnabler,
  getAllEnabler,
] = createCRUD<Enabler>('genericItem');
export const [
  getOutcome,
  createOutcome,
  updateOutcome,
  deleteOutcome,
  searchOutcome,
  getAllOutcome,
] = createCRUD<Outcome>('output');
export const [
  getTheme,
  createTheme,
  updateTheme,
  deleteTheme,
  searchTheme,
  getAllTheme,
] = createCRUD<Theme>('mission');
export const [
  getOperation,
  createOperation,
  updateOperation,
  deleteOperation,
  searchOperation,
  getAllOperation,
] = createCRUD<Operation>('operation');
export const [
  getObjective,
  createObjective,
  updateObjective,
  deleteObjective,
  searchObjective,
  getAllObjective,
] = createCRUD<Objective>('objective');
export const [
  getExcellenceCriteria,
  createExcellenceCriteria,
  updateExcellenceCriteria,
  deleteExcellenceCriteria,
  searchExcellenceCriteria,
  getAllExcellenceCriteria,
] = createCRUD<ExcellenceCriteria>('excellenceCriteria');
export const [
  getGenericItem,
  createGenericItem,
  updateGenericItem,
  deleteGenericItem,
  searchGenericItem,
  getAllGenericItem,
] = createCRUD<GenericItem>('genericItem');
export const [
  getLink,
  createLink,
  updateLink,
  deleteLink,
  searchLink,
  getAllLink,
] = createCRUD<Link>('Link');
export const [
  getUAEVisionGoal,
  createUAEVisionGoal,
  updateUAEVisionGoal,
  deleteUAEVisionGoal,
  searchUAEVisionGoal,
  getAllUAEVisionGoal,
] = createCRUD<UAEVisionGoal>('goal');
export const [
  getADVisionGoal,
  createADVisionGoal,
  updateADVisionGoal,
  deleteADVisionGoal,
  searchADVisionGoal,
  getAllADVisionGoal,
] = createCRUD<ADVisionGoal>('goal');

export const [
  getSiteSettings,
  createSiteSettings,
  updateSiteSettings,
  deleteSiteSettings,
  searchSiteSettings,
  getAllSiteSettings,
] = createCRUD<Setting>('settings');

export const [
  getLookup,
  createLookup,
  updateLookup,
  deleteLookup,
  searchLookup,
  getAllLookup,
] = createCRUD<Lookup>('Lookup');

export const [
  getOrganizationUnitUser,
  createOrganizationUnitUser,
  updateOrganizationUnitUser,
  deleteOrganizationUnitUser,
  searchOrganizationUnitUser,
  getAllOrganizationUnitUser,
] = createCRUD<OrganizationUnitUser>('OrganizationUnitUser');

export function createResource(type: BalancedScorecardItemType, values: any) {
  switch (type) {
    case BalancedScorecardItemType.DevelopmentGoal:
      return createDevelopmentGoal(values);
    case BalancedScorecardItemType.MofaGoal:
      return createMofaGoal(values);
    case BalancedScorecardItemType.Goal:
      return createGoal(values);
    case BalancedScorecardItemType.Enabler:
      return createEnabler(values);
    case BalancedScorecardItemType.Outcome:
      return createOutcome(values);
    case BalancedScorecardItemType.Theme:
      return createTheme(values);
    case BalancedScorecardItemType.Operation:
      return createOperation(values);
    case BalancedScorecardItemType.Objective:
      return createObjective(values);
    case BalancedScorecardItemType.KPI:
      return createKpi(values);
    case BalancedScorecardItemType.GenericItem:
      return createGenericItem(values);
    case BalancedScorecardItemType.Link:
      return createLink(values);
	case BalancedScorecardItemType.UAEVisionGoal:
	  return createUAEVisionGoal(values);
	case BalancedScorecardItemType.ADVisionGoal:
	  return createADVisionGoal(values);
    default:
      throw new UnreachableCaseError(type);
  }
}

export function updateResource(
  type: BalancedScorecardItemType,
  id: number,
  values: any
) {
  switch (type) {
    case BalancedScorecardItemType.DevelopmentGoal:
      return updateDevelopmentGoal(id, values);
    case BalancedScorecardItemType.MofaGoal:
      return updateMofaGoal(id, values);
    case BalancedScorecardItemType.Goal:
      return updateGoal(id, values);
    case BalancedScorecardItemType.Enabler:
      return updateEnabler(id, values);
    case BalancedScorecardItemType.Outcome:
      return updateOutcome(id, values);
    case BalancedScorecardItemType.Theme:
      return updateTheme(id, values);
    case BalancedScorecardItemType.Operation:
      return updateOperation(id, values);
    case BalancedScorecardItemType.Objective:
      return updateObjective(id, values);
    case BalancedScorecardItemType.KPI:
      return updateKpi(id, values);
    case BalancedScorecardItemType.GenericItem:
      return updateGenericItem(id, values);
    case BalancedScorecardItemType.Link:
      return updateLink(id, values);
	case BalancedScorecardItemType.UAEVisionGoal:
	  return updateUAEVisionGoal(id, values);
	case BalancedScorecardItemType.ADVisionGoal:
	  return updateADVisionGoal(id, values);
    default:
      throw new UnreachableCaseError(type);
  }
}

export function deleteResource(type: BalancedScorecardItemType, id: number) {
  switch (type) {
    case BalancedScorecardItemType.DevelopmentGoal:
      return deleteDevelopmentGoal(id);
    case BalancedScorecardItemType.MofaGoal:
      return deleteMofaGoal(id);
    case BalancedScorecardItemType.Goal:
      return deleteGoal(id);
    case BalancedScorecardItemType.Enabler:
      return deleteEnabler(id);
    case BalancedScorecardItemType.Outcome:
      return deleteOutcome(id);
    case BalancedScorecardItemType.Theme:
      return deleteTheme(id);
    case BalancedScorecardItemType.Operation:
      return deleteOperation(id);
    case BalancedScorecardItemType.Objective:
      return deleteObjective(id);
    case BalancedScorecardItemType.KPI:
      return deleteKpi(id);
    case BalancedScorecardItemType.GenericItem:
      return deleteGenericItem(id);
    case BalancedScorecardItemType.Link:
      return deleteLink(id);
	case BalancedScorecardItemType.UAEVisionGoal:
	  return deleteUAEVisionGoal(id);
	case BalancedScorecardItemType.ADVisionGoal:
	  return deleteADVisionGoal(id);
    default:
      throw new UnreachableCaseError(type);
  }
}

export function getResource(type: BalancedScorecardItemType, id: number) {
  switch (type) {
    case BalancedScorecardItemType.DevelopmentGoal:
      return getDevelopmentGoal(id);
    case BalancedScorecardItemType.MofaGoal:
      return getMofaGoal(id);
    case BalancedScorecardItemType.Goal:
      return getGoal(id);
    case BalancedScorecardItemType.Enabler:
      return getEnabler(id);
    case BalancedScorecardItemType.Outcome:
      return getOutcome(id);
    case BalancedScorecardItemType.Theme:
      return getTheme(id);
    case BalancedScorecardItemType.Operation:
      return getOperation(id);
    case BalancedScorecardItemType.Objective:
      return getObjective(id);
    case BalancedScorecardItemType.KPI:
      return getKpi(id);
    case BalancedScorecardItemType.GenericItem:
      return getGenericItem(id);
    case BalancedScorecardItemType.Link:
      return getLink(id);
	case BalancedScorecardItemType.UAEVisionGoal:
	  return getUAEVisionGoal(id);
	case BalancedScorecardItemType.ADVisionGoal:
	  return getADVisionGoal(id);
    default:
      throw new UnreachableCaseError(type);
  }
}
export function searchResource(type: BalancedScorecardItemType, criteria: any) {
  switch (type) {
    case BalancedScorecardItemType.DevelopmentGoal:
      return searchDevelopmentGoal(criteria);
    case BalancedScorecardItemType.MofaGoal:
      return searchMofaGoal(criteria);
    case BalancedScorecardItemType.Goal:
      return searchGoal(criteria);
    case BalancedScorecardItemType.Enabler:
      return searchEnabler(criteria);
    case BalancedScorecardItemType.Outcome:
      return searchOutcome(criteria);
    case BalancedScorecardItemType.Theme:
      return searchTheme(criteria);
    case BalancedScorecardItemType.Operation:
      return searchOperation(criteria);
    case BalancedScorecardItemType.Objective:
      return searchObjective(criteria);
    case BalancedScorecardItemType.KPI:
      return searchKpi(criteria);
    case BalancedScorecardItemType.GenericItem:
      return searchGenericItem(criteria);
    case BalancedScorecardItemType.Link:
      return searchLink(criteria);
	case BalancedScorecardItemType.UAEVisionGoal:
	  return searchUAEVisionGoal(criteria);
	case BalancedScorecardItemType.ADVisionGoal:
	  return searchADVisionGoal(criteria);
    default:
      throw new UnreachableCaseError(type);
  }
}

export function getAllResources(
  type: BalancedScorecardItemType
): Rx.Observable<Resource[]> {
  switch (type) {
    case BalancedScorecardItemType.DevelopmentGoal:
      return getAllDevelopmentGoal();
    case BalancedScorecardItemType.MofaGoal:
      return getAllMofaGoal();
    case BalancedScorecardItemType.Goal:
      return getAllGoal();
    case BalancedScorecardItemType.Enabler:
      return getAllEnabler();
    case BalancedScorecardItemType.Outcome:
      return getAllOutcome();
    case BalancedScorecardItemType.Theme:
      return getAllTheme();
    case BalancedScorecardItemType.Operation:
      return getAllOperation();
    case BalancedScorecardItemType.Objective:
      return getAllObjective();
    case BalancedScorecardItemType.KPI:
      return getAllKpi();
    case BalancedScorecardItemType.GenericItem:
      return getAllGenericItem();
    case BalancedScorecardItemType.Link:
      return getAllLink();
	case BalancedScorecardItemType.UAEVisionGoal:
	  return getAllUAEVisionGoal();
	case BalancedScorecardItemType.ADVisionGoal:
	  return getAllADVisionGoal();
    default:
      throw new UnreachableCaseError(type);
  }
}

export function getSkills() {
  return _makeRequest<Skill[]>({
    method: 'get',
    url: '/Skill',
  });
}

export const [
  getExcellenceRequirement,
  createExcellenceRequirement,
  updateExcellenceRequirement,
  deleteExcellenceRequirement,
  searchExcellenceRequirements,
  getAllExcellenceRequirements,
] = createCRUD<ExcellenceRequirement>('ExcellenceRequirement');

export const [
  getExcellenceTheme,
  createExcellenceTheme,
  updateExcellenceTheme,
  deleteExcellenceTheme,
  searchExcellenceTheme,
  getAllExcellenceTheme,
] = createCRUD<ExcellenceTheme>('ExcellenceTheme');

export const [
  getReports,
  createReports,
  updateReports,
  deleteReports,
  searchReports,
  getAllReports,
] = createCRUD<any>('reports');

export const [
  getTask,
  createTask,
  updateTask,
  deleteTask,
  searchTask,
  getAllTask,
] = createCRUD<Task>('Task');

export const [
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  searchChallenge,
  getAllChallenge,
] = createCRUD<Challenge>('Challenge');

export const [
  getChallengeAction,
  createChallengeAction,
  updateChallengeAction,
  deleteChallengeAction,
  searchChallengeAction,
  getAllChallengeAction,
] = createCRUD<ChallengeAction>('ChallengeAction');

export const [
  getInitiativeSkill,
  createInitiativeSkill,
  updateInitiativeSkill,
  deleteInitiativeSkill,
  searchInitiativeSkill,
  getAllInitiativeSkill,
] = createCRUD<InitiativeSkill>('InitiativeSkill');

export const [
  getStrategicMap,
  createStrategicMap,
  updateStrategicMap,
  deleteStrategicMap,
  searchStrategicMap,
  getAllStrategicMap,
] = createCRUD<StrategicMap>('StrategicMap');

export function recalculatePerformance() {
  return _makeRequest<any>({
    method: 'get',
    url: `/dev/engines/performance/recalculate`,
  });
}

export function BalancedScorecardReport(items: any) {
  return _makeRequest<any>({
    method: 'post',
    url: `/scorecard/report`,
    body: items,
  });
}

export const [
  getScorecardsList,
  createScorecardsList,
  updateScorecardsList,
  deleteScorecardsList,
  searchScorecardsList,
  getAllScorecardsList,
] = createCRUD<BalancedScorecard>('Scorecard');

export const [
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  searchSkill,
  getAllSkill,
] = createCRUD<Skill>('Skill');

export const [
  getRiskManagementItem,
  createRiskManagementItem,
  updateRiskManagementItem,
  deleteRiskManagementItem,
  searchRiskManagementItem,
  getAllRiskManagementItem,
] = createCRUD<RiskManagementItem>('RiskManagementItem');

export const [
  getReportingCycle,
  createReportingCycle,
  updateReportingCycle,
  deleteReportingCycle,
  searchReportingCycle,
  getAllReportingCycle,
] = createCRUD<ReportingCycle>('ReportingCycle');

export function startReportingCycle(id: number, values: any) {
  return _makeRequest<any>({
    method: 'post',
    url: `/reportingCycle/${id}`,
    body: values,
  });
}
export function cancelReportingCycle(id: number, values: any) {
  return _makeRequest<any>({
    method: 'put',
    url: `/reportingCycle/${id}`,
    body: values,
  });
}

export const [
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  searchOrganizations,
  getAllOrganizations,
] = createCRUD<Organization>('Organization');

export function addChallengeActionComment(
  challengeAction: number,
  values: any
) {
  return _makeRequest<any>({
    method: 'post',
    url: `/ChallengeAction/${challengeAction}/comments`,
    body: values,
  });
}

export function createChallengeResponse(challengeId: number) {
  return _makeRequest<any>({
    method: 'post',
    url: `/Challenge/${challengeId}/response`,
  });
}

export function createChallengeReviewResponse(
  challengeId: number,
  values: any
) {
  return _makeRequest<any>({
    method: 'post',
    url: `/Challenge/${challengeId}/review`,
    body: values,
  });
}

export function initiativeNewCycle(values: any) {
  return _makeRequest<any>({
    method: 'post',
    url: `/reportingCycle/workflow`,
    body: values,
  });
}

export const [
  getUnitReport,
  createUnitReport,
  updateUnitReport,
  deleteUnitReport,
  searchUnitReport,
  getAllUnitReport,
] = createCRUD<UnitReport>('UnitReport');

export function updateKpiReportDataSeries(
  reportId: number,
  id: number,
  value: number
) {
  return _makeRequest<{ items: ObjectPerformance[] }>({
    method: 'put',
    url: `/UnitReport/kpi/${reportId}/data-series/${id}`,
    body: { value },
  }).pipe(Rx.map(ret => ret.items));
}

export function createKpiReportDataSeriesComment(
  reportId: number,
  dataSeriesId: number,
  values: any
) {
  return _makeRequest<KpiReportComment>({
    method: 'post',
    url: `/UnitReport/kpi/${reportId}/data-series/${dataSeriesId}/comments`,
    body: values,
  });
}
export function createExcellenceReportItemComment(
  reportId: number,
  itemId: number,
  values: any
) {
  return _makeRequest<ExcellenceReportItemComment>({
    method: 'post',
    url: `/UnitReport/excellence/${reportId}/items/${itemId}/comments`,
    body: values,
  });
}

export function validateExcellenceReport(reportId: number) {
  return _makeRequest<ReportValidation>({
    method: 'post',
    url: `/UnitReport/excellence/${reportId}`,
  });
}

export function submitKpiReport(reportId: number, values: any) {
  return _makeRequest<any>({
    method: 'put',
    url: `/UnitReport/kpi/${reportId}`,
    body: values,
  });
}
export function submitExcellenceReport(reportId: number, values: any) {
  return _makeRequest<any>({
    method: 'put',
    url: `/UnitReport/excellence/${reportId}`,
    body: values,
  });
}

export function createKpiReportComment(reportId: number, values: any) {
  return _makeRequest<KpiReportComment>({
    method: 'post',
    url: `/UnitReport/kpi/${reportId}/comments`,
    body: values,
  });
}

export function createUnitReportComment(reportId: number, values: any) {
  return _makeRequest<UnitReportComment>({
    method: 'post',
    url: `/UnitReport/${reportId}/comments`,
    body: values,
  });
}

export function rejectKpiReport(reportId: number) {
  return _makeRequest<any>({
    method: 'put',
    url: `/UnitReport/kpi/${reportId}/rejection`,
  });
}

export function approveKpiReport(reportId: number) {
  return _makeRequest<any>({
    method: 'put',
    url: `/UnitReport/kpi/${reportId}/approval`,
  });
}

export function rejectExcellenceReport(reportId: number) {
  return _makeRequest<any>({
    method: 'put',
    url: `/UnitReport/excellence/${reportId}/rejection`,
  });
}

export function approveExcellenceReport(reportId: number) {
  return _makeRequest<any>({
    method: 'put',
    url: `/UnitReport/excellence/${reportId}/approval`,
  });
}

export function getKpiReport(reportId: number) {
  return _makeRequest<KPIReport>({
    method: 'get',
    url: `/UnitReport/kpi/${reportId}`,
  });
}

export function getExcellenceReport(reportId: number) {
  return _makeRequest<ExcellenceReport>({
    method: 'get',
    url: `/UnitReport/excellence/${reportId}`,
  });
}

export const [
  getUser,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  getAllUsers,
] = createCRUD<User>('User');

export const [
  getOrgUser,
  createOrgUser,
  updateOrgUser,
  deleteOrgUser,
  searchOrgUsers,
  getAllOrgUsers,
] = createCRUD<OrgUser>('OrgUser');

export const [
  getRole,
  createRole,
  updateRole,
  deleteRole,
  searchRoles,
  getAllRoles,
] = createCRUD<Role>('Role');

export const [
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
  searchPermissions,
  getAllPermissions,
] = createCRUD<Permission>('Permission');

export function uploadFile(file: File) {
  const data = new FormData();
  data.append('file', file, file.name);
  return _makeRequest<FileDocument>({
    method: 'post',
    url: '/documents',
    body: data,
    fileUpload: true,
  });
}

export function createExcellenceEvidence(id: number, values: any) {
  return _makeRequest<ExcellenceEvidence[]>({
    method: 'post',
    url: `/excellenceRequirement/${id}/evidence`,
    body: values,
  });
}

export function createKpiEvidence(id: number, values: any) {
  return _makeRequest<ExcellenceEvidence[]>({
    method: 'post',
    url: `/kpi/${id}/evidence`,
    body: values,
  });
}

export function submitReportingCycle(id: number, values: any) {
  return _makeRequest<ExcellenceReportItemComment>({
    method: 'put',
    url: `/ReportingCycle/${id}/submission`,
    body: values,
  });
}

export const [
  getDashboard,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  searchDashboard,
  getAllDashboard,
] = createCRUD<Dashboard>('Dashboard');

export function searchKpiReports(values: any) {
  return _makeRequest<ListResult<ReportStats>>({
    method: 'post',
    url: `/report/kpi-performance/search`,
    body: values,
  });
}

export function searchKpiPerformanceStats(values: any) {
  return _makeRequest<ListResult<ReportStats>>({
    method: 'post',
    url: `/report/kpi-performance/stats`,
    body: values,
  }).pipe(Rx.map(ret => ret.items));
}

export function searchInitiativeStats(values: any) {
  return _makeRequest<ListResult<ReportStats>>({
    method: 'post',
    url: `/report/initiative-item/stats`,
    body: values,
  }).pipe(Rx.map(ret => ret.items));
}

export function searchExcellencePerformanceStats(values: any) {
  return _makeRequest<ListResult<ReportStats>>({
    method: 'post',
    url: `/report/excellence/stats`,
    body: values,
  }).pipe(Rx.map(ret => ret.items));
}

export function searchExcellenceReports(values: any) {
  return _makeRequest<ListResult<ReportStats>>({
    method: 'post',
    url: `/report/excellence/search`,
    body: values,
  }).pipe(Rx.map(ret => ret.items));
}

export function getMyKpiPerformanceReport(criteria: any) {
  return _makeRequest<ListResult<UserKpiReport>>({
    method: 'post',
    url: `/report/kpi-performance/my`,
    body: criteria,
  }).pipe(Rx.map(ret => ret.items));
}

export function downloadDocument(type: string, lang: string, id: number) {
  return _makeRequest<ListResult<UserKpiReport>>({
    method: 'post',
    url: `/reports/${id}/files?type=${type}&lang=${lang}`,
    body: { type: `${type}` },
  });
}

export function getManualReports(id: number) {
  return _makeRequest<ListResult<UserKpiReport>>({
    method: 'get',
    url: `/reports/${id}/data`,
  });
}

export const [
  getComment,
  createComment,
  updateComment,
  deleteComment,
  searchComment,
  getAllComment,
] = createCRUD<Comment>('Comment', true);

export function getDocument(id: number) {
  return _makeRequest<FileDocument>({
    method: 'get',
    url: `/documents/${id}`,
  });
}

export function getDocumentByToken(token: string) {
  return _makeRequest<FileDocument>({
    method: 'get',
    url: `/documents/files?token=${token}`,
  });
}

export function getMyObjectPerformanceMeasures(values: any) {
  return _makeRequest<MyKpiMeasureItem[]>({
    method: 'post',
    url: `/objectPerformanceSeries/measures/search/my`,
    body: values,
  });
}

export function getMyBscList(values: any) {
  return _makeRequest<SearchResult<BalancedScorecard>>({
    method: 'post',
    url: `/Scorecard/my-bsc-list`,
    body: values,
  });
}

export function getScorecardStats(values: any) {
  return _makeRequest<ScorecardStats>({
    method: 'post',
    url: `/Scorecard/stats`,
    body: values,
  });
}

export function searchScorecardAllowedParent(values: any) {
  return _makeRequest<SearchResult<BalancedScorecardItemAllowedParent>>({
    method: 'post',
    url: `/balancedScorecardItemAllowedParent/search `,
    body: values,
  });
}

export function getResponsibleUnits(values: any) {
  return _makeRequest<OrganizationUnit[]>({
    method: 'post',
    url: `/dashboard/search/responsibleUnits`,
    body: values,
  });
}

export function getUnitReportValidation(id: number) {
  return _makeRequest<KPISeriesReportValidation>({
    method: 'get',
    url: `/UnitReporting/${id}/validation`,
  });
}

export function submitUnitReport(reportId: number, values: any) {
  return _makeRequest<any>({
    method: 'post',
    url: `/UnitReporting/${reportId}`,
    body: values,
  });
}

export function submitScorecard(reportId: number, values: any) {
  return _makeRequest<any>({
    method: 'put',
    url: `/UnitReporting/${reportId}`,
    body: values,
  });
}
