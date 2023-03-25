import { RawDraftContentState } from 'draft-js';

export interface User {
  id: string;
  isAdmin?: boolean;
  isActive: boolean;
  name: TransString;
  email: string;
  username: string;
  password: string;
  roles: string[];
}

export interface RouteConfig {
  type: 'route';
  path: string | string[];
  exact?: boolean;
  auth: boolean;
  component: React.ReactElement<any>;
}

export interface Role {
  id: string;
  name: TransString;
  permissions: Permission[];
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  pageNumber: number;
  pageSize: number;
}

export type Permission =
  | 'roles:view'
  | 'roles:export'
  | 'role:view'
  | 'role:add'
  | 'role:update'
  | 'role:delete'
  | 'users:view'
  | 'users:export'
  | 'user:view'
  | 'user:add'
  | 'user:update'
  | 'user:delete'
  | 'locations:view'
  | 'locations:export'
  | 'location:view'
  | 'location:add'
  | 'location:update'
  | 'location:delete'
  | 'organization-structure:view'
  | 'organization-structure:add'
  | 'organization-structure:edit'
  | 'organization-structure:delete'
  | 'organization-structure:update'
  | 'goals:view'
  | 'goals:export'
  | 'goal:add'
  | 'goal:edit'
  | 'goal:view'
  | 'goal:delete'
  | 'outputs:view'
  | 'outputs:export'
  | 'output:add'
  | 'output:edit'
  | 'output:view'
  | 'output:delete'
  | 'missions:view'
  | 'missions:export'
  | 'mission:add'
  | 'mission:edit'
  | 'mission:view'
  | 'mission:delete'
  | 'unitObjectives:view'
  | 'unitObjectives:export'
  | 'unitObjective:add'
  | 'unitObjective:edit'
  | 'unitObjective:view'
  | 'unitObjective:delete'
  | 'operations:view'
  | 'operations:export'
  | 'operation:add'
  | 'operation:edit'
  | 'operation:view'
  | 'operation:delete'
  | 'strategic-plans:view'
  | 'strategic-plans:export'
  | 'strategic-plan:add'
  | 'strategic-plan:edit'
  | 'strategic-plan:view'
  | 'metrics:view'
  | 'metrics:export'
  | 'metric:view'
  | 'metric:add'
  | 'metric:update'
  | 'metric:delete'
  | 'initiatives:view'
  | 'initiatives:export'
  | 'initiative:view'
  | 'initiative:add'
  | 'initiative:edit'
  | 'initiative:delete'
  | 'kpis:view'
  | 'kpis:export'
  | 'kpi:view'
  | 'kpi:add'
  | 'kpi:edit'
  | 'kpi:delete'
  | 'kpi:data-entry'
  | 'excellence-standards:view'
  | 'excellence-standards:export'
  | 'excellence-standard:view'
  | 'excellence-standard:add'
  | 'excellence-standard:edit'
  | 'excellence-standard:delete'
  | 'excellence-requirements:view'
  | 'excellence-requirements:export'
  | 'excellence-requirement:view'
  | 'excellence-requirement:add'
  | 'excellence-requirement:edit'
  | 'excellence-requirement:delete'
  | 'strategic-map:view'
  | 'challenges:view'
  | 'challenges:export'
  | 'challenge:view'
  | 'challenge:add'
  | 'challenge:edit'
  | 'challenge:delete';

export interface Notification {
  id: number;
  type: 'error' | 'success';
  text: string;
}

export interface SearchOptions {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDesc: boolean;
}

export interface SelectOption<T = any> {
  label: any;
  value: T;
  id?: any;
  filterName?: string | number;
}

export interface TransString {
  en: string;
  ar: string;
  [x: string]: string;
}

export type PermissionMap = { [x in Permission]?: Permission };
export type IdMap = { [x: string]: string };

export interface Location {
  id: string;
  name: TransString;
  address: TransString;
  poBox: string;
  city: string;
  country: string;
  isHeadquarter: boolean;
  long: number;
  lat: number;
}

export interface StrategicPlan {
  id: string;
  name: TransString;
  startDate: number;
  endDate: number;
  vision: TransString;
  mission: TransString;
  values: TransString;
  strengths: TransString;
  weaknesses: TransString;
  opportunities: TransString;
  threats: TransString;
}

export interface OrganizationStructure {
  id: string;
  name: TransString;
  children: OrganizationStructure[];
  type?: UnitTypes;
}

export interface OrgStructureTree {
  title: string;
  expanded: boolean;
  id: number | string;
  children: OrgStructureTree[] | [];
}

export type Status = 'active' | 'draft';

export interface Goal {
  id: string;
  name: TransString;
  description: TransString;
  createdTime: string;
  status: Status;
  parent: string;
  strategicPlanId: string;
}

export interface Output {
  id: string;
  name: TransString;
  description: TransString;
  notes: string;
  createdTime: string;
  status: Status;
  goalId: string;
  goalName?: TransString;
  strategicPlanId: string;
}

export interface Mission {
  id: string;
  name: TransString;
  description: TransString;
  createdTime: string;
  status: Status;
  outputId: string;
  outputName?: TransString;
  strategicPlanId: string;
}

export interface UnitObjective {
  id: string;
  lastUpdatedTime: string;
  lastUpdatedById: string;
  name: TransString;
  description: TransString;
  createdTime: string;
  status: Status;
  missionId: string;
  missionName?: TransString;
  targetUnitId: string;
  responsiblePersonId: string;
  notes: string;
  strategicPlanId: string;
}

export interface Operation {
  id: string;
  name: TransString;
  description: TransString;
  createdTime: string;
  status: Status;
  targetUnitId: string;
  responsiblePersonId: string;
  goalIds: string[];
  goals?: Goal[];
  notes: string;
  strategicPlanId: string;
  unitObjectiveId: string;
}

export interface Metric {
  id: string;
  name: TransString;
  enabled: boolean;
  metricType: string;
  dataType: string;
  dataSource: string;
}

export type UnitTypes = 'Section' | 'Department' | 'Division'

export interface Initiative {
  id: string;
  name: TransString;
  description: TransString;
  createdTime: string;
  status: Status;
  startDate: string;
  endDate: string;
  performanceTillDate: number;
  trackImplementation: boolean;
  budget: number;
  responsiblePersonId: string;
  goalIds: string[];
  goals?: Goal[];
  notes: string;
  strategicPlanId: string;
  unitObjectiveId: string;
}

export type KpiType = 'board' | 'leadership' | 'operational';
export type KpiLinkedObjectType =
  | 'goal'
  | 'output'
  | 'mission'
  | 'operation'
  | 'initiative'
  | 'unitObjective';
export type KpiTrend =
  | 'increasingBetter'
  | 'asTarget'
  | 'bounded'
  | 'decreasingBetter'
  | 'quantitative';
export type MeasurementFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly';
export type MeasurementUnit = 'percentage' | 'number' | 'rank';
export type MeasurementMechanism = 'fixedValue' | 'formula' | 'impacted';
export type PerformanceTillDate =
  | 'lastValue'
  | 'sum'
  | 'average'
  | 'min'
  | 'max';

export interface Kpi {
  id: string;
  status: Status;
  name: TransString;
  strategicPlanId: string;
  lastCalculatedTime: string;
  lastUpdatedTime: string;
  lastUpdatedById: string;

  info: {
    type: KpiType;
    linkedObject: string;
    linkedObjectType: KpiLinkedObjectType;
    description: TransString;
    concernedUnit: string;
    contributors: string[];
    focalPointUser: string;
    startDate: number;
    endDate: number;
  };

  measurement: {
    unit: MeasurementUnit;
    unitDescription: string;
    frequency: MeasurementFrequency;
    trend: KpiTrend;
    hasBaseline: boolean;
    baselineYear?: number;
    baselineValue?: string;
    mechanism: MeasurementMechanism;
    performanceTillDate: PerformanceTillDate;
    formula?: RawDraftContentState;
  };

  targets: {
    isSum?: boolean;
    upperBound?: number;
    lowerBound?: number;
    targets: KpiTarget[];
  };

  benchmarks: KpiBenchmark[];
  attachments: KpiAttachment[];
  data: {
    [x: string]: number;
  };
  linkedKpis?: string[];
}

export interface KpiLinkedCalculation {
  performance: number;
  performanceTillDate: number;
}

export interface PopulatedKpi extends Kpi {
  targetUnit: OrganizationStructure;
  responsiblePerson: User;
  lastUpdatedBy: User;
}

export interface KpiBenchmark {
  id: string;
  name: string;
  type: string;
  groups: KpiBenchmarkGroup[];
}

export interface KpiBenchmarkGroup {
  id: string;
  country: string;
  year: number;
  value: number;
  source?: string;
}

export interface KpiTarget {
  period: any;
  value: number;
}

export interface KpiAttachment {
  name: string;
  url: string;
}

export type KpiCalculationStatusColor =
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red'
  | 'gray';

export interface KpiCalculationPeriod {
  year: number;
  half?: number;
  quarter?: number;
  month?: number;
  target: number | null;
  actual: number | null;
  performance: number | null;
  performanceTillDate: number | null;
  yearlyPerformance: number | null;
  statusColor: KpiCalculationStatusColor;
  period: string;
}

export type NoteTarget = 'kpi' | 'unitObjective';

export interface Note {
  id: string;
  target: NoteTarget;
  targetId: string;
  createdAt: string;
  authorId: string;
  author?: User;
  description: string;
}

export type LinkedObject =
  | Goal
  | Initiative
  | Output
  | Mission
  | Operation
  | UnitObjective;

export interface ExcellenceStandard {
  id: string;
  name: TransString;
  createdTime: string;
  status: Status;
  parent: string | null;
  strategicPlanId: string;
  missionId: string;
}

export interface ExcellenceRequirement {
  id: string;
  name: TransString;
  description: TransString;
  createdTime: string;
  status: Status;
  strategicPlanId: string;
  excellenceStandardId: string;
  unitObjectiveId: string;
  targetUnitId: string;
  responsiblePersonId: string;
  standardName?: TransString;
  startDate: number;
  endDate: number;
}

export type ReferenceType =
  | 'unitObjectives'
  | 'users'
  | 'organizationStructures'
  | 'operations'
  | 'initiatives'
  | 'metrics'
  | 'missions'
  | 'outputs'
  | 'goals'
  | 'excellenceStandards';

export interface PopulatedUnitObjective extends UnitObjective {
  targetUnit: OrganizationStructure;
  responsiblePerson: User;
  lastUpdatedBy: User;
  mission: Mission;
  kpis: Kpi[];
  excellenceRequirements: ExcellenceRequirement[];
  operations: Operation[];
  initiatives: Initiative[];
}

export type ChallengeItemType =
  | 'goal'
  | 'output'
  | 'mission'
  | 'unitObjective'
  | 'operation'
  | 'initiative'
  | 'kpi'
  | 'excellenceStandard'
  | 'excellenceRequirement';

export interface Challenge {
  id: string;
  name: TransString;
  description: TransString;
  affectedUnitId: string;
  affectedUnitName?: TransString;
  challengedUnitId: string;
  challengedUnitName?: TransString;
  status: Status;
  period: string;
  itemId: string;
  itemType: ChallengeItemType;
  itemName?: TransString;
  notes: string;
  createdTime: string;
  strategicPlanId: string;
}

export interface FrequencyPeriod {
  frequency: MeasurementFrequency;
  year: number;
  half?: number;
  quarter?: number;
  month?: number;
}

export type DragHandleType = 'nw' | 'ne' | 'sw' | 'se';
