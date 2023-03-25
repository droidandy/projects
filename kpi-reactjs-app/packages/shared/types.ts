export type SortType = 'ASC' | 'DESC';

export interface TransString {
  en: string;
  ar: string;
  [x: string]: string;
}

export interface BaseNamed {
  id: number;
  name: TransString;
  description: TransString;
}

export interface BalancedScorecard extends BaseNamed {
  strategicPlanId: number;
  unitId: number;
  organizationId: number;
  scorecardItems: BalancedScorecardItem[];
  objectPerformance: ObjectPerformance;
  objectPerformances: ObjectPerformance[];
}

export interface OrgUser {
  id: number;
  orgId: number;
  userId: number;
  unitId: number;
  user: User;
  orgUserRoles: OrgUserRole[];
}

export interface OrganizationUnitUser {
  id: number;
  onLeave: boolean;
  primary: boolean;
  role: OrganizationUnitUserRole;
  orgUser: OrgUser;
  orgUserId: number;
  unitId: number;
}

export interface OrgUserRole {
  orgUserId: number;
  roleId: number;
  role: Role;
}

export interface User {
  id: number;
  orgId: number;
  name: TransString;
  email: string;
  username: string;
  roles: any[];
  orgUsers: OrgUser[];
}

export interface Organization {
  id: number;
  name: TransString;
}

export interface OrganizationUnit extends BaseNamed {
  parentId: number;
  organizationId?: number;
  type?: 'Section' | 'Department' | 'Division';
  iconId?: number | null;
  icon?: FileDocument | null;
}

export interface StrategicPlan extends BaseNamed {
  startYear: number;
  endYear: number;
  vision: StrategicPlanItem;
  mission: StrategicPlanItem;
  values: StrategicPlanItem;
  strengths: StrategicPlanItem;
  weaknesses: StrategicPlanItem;
  opportunities: StrategicPlanItem;
  threats: StrategicPlanItem;
  organizationId: number;
}

export interface StrategicPlanItem {
  id?: number;
  text: TransString;
  iconId: number | null;
  icon?: FileDocument | null;
  field?: string;
  content: StrategicPlanItemContent[];
}

interface StrategicPlanItemContent {
  id: number;
  text: TransString;
  icon: FileDocument;
}

export interface CreateScorecardValues
  extends Omit<BalancedScorecard, 'id' | 'scorecardItems'> {}

export interface BaseResource extends BaseNamed {
  versionId: string;
  isDefault: boolean;
  startDate: string;
  endDate: string;
  status: any;
}

export interface UserInitiativeItemRole {
  id: number;
  roleId: number;
  role?: any;
  userId: number;
}

export interface UserBscRole {
  id: number;
  roleId: number;
  role?: any;
  orgUserId: number;
}

export interface BalancedScorecardItem extends BaseResource {
  balancedScorecardId: number;
  parentId: number | null;
  typeId: number;
  responsibleUnitId: number;
  type: Lookup;
  userBscRoles: UserBscRole[];
}

export type LookupCategory =
  | 'BalancedScorecardTag'
  | 'KPIScoringType'
  | 'KPICalendar'
  | 'KPIDataType'
  | 'KPIType'
  | 'BalancedScorecardItemType'
  | 'InitiativeItemType'
  | 'Currency';

export interface ReportPage {
  en: string;
  ar: string;
  [x: string]: any;
}

export interface Lookup {
  category: LookupCategory;
  en: string;
  ar: string;
  id: number;
  slug: string;
  [x: string]: any;
}

export interface RelatedKpi {
  relatedKpiId: number;
  relatedKpiName: TransString;
  weight: number;
}

export interface Kpi extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.KPI;
  responsibleUnitId: number;
  kpiCode: string;
  dataSeries: DataSeries[];
  kpiLevelId: number;
  kpiTypeId: number;
  dataTypeId: number;
  dataType: Lookup;
  dataTypeDesc: string;
  periodFrequency: PeriodFrequency;
  scoringTypeId: number;
  aggregationType: AggregationType;
  actualValueType: KpiValueType;
  targetValueType: KpiValueType;
  redThresholdPct: number;
  yellowThresholdPct: number;
  targetThresholdPct: number;
  bestThresholdPct: number;
  lowThresholdPct: number;
  highThresholdPct: number;
  greenInsideBoundaries: boolean;
  relatedKpis: RelatedKpi[];
  isSeriesAggregated: boolean;
  maxLimit: number;
  evidences: KpiEvidence[];
}

export interface DevelopmentGoal extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.DevelopmentGoal;
}

export interface MofaGoal extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.MofaGoal;
}

export interface Goal extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.Goal;
}

export interface Enabler extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.Enabler;
}

export interface Outcome extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.Outcome;
}

export interface Theme extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.Theme;
}

export interface Operation extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.Operation;
}

export interface Objective extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.Objective;
}

export interface ExcellenceCriteria {
  id: number;
  name: TransString;
  parentCriteria?: ExcellenceCriteria | null;
  parentId: number | null;
  subCriteria?: ExcellenceCriteria[] | any;
  createdDate?: string;
}

export interface GenericItem extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.GenericItem;
}

export interface Link extends BalancedScorecardItem {
  typeId: BalancedScorecardItemType.Link;
}

export type Resource =
  | Kpi
  | DevelopmentGoal
  | MofaGoal
  | Goal
  | Enabler
  | Outcome
  | Theme
  | Operation
  | Objective
  | GenericItem
  | Link;

export type BalancedScorecardItemSlug =
  | 'bsi-type-development-goal'
  | 'bsi-type-mofa-goal'
  | 'bsi-type-ad-vision-2030'
  | 'bsi-type-uae-vision-2021'
  | 'bsi-type-goal'
  | 'bsi-type-enabler'
  | 'bsi-type-outcome'
  | 'bsi-type-theme'
  | 'bsi-type-objective'
  | 'bsi-type-operation'
  | 'bsi-type-excellence-criteria'
  | 'bsi-type-generic-item'
  | 'bsi-type-kpi'
  | 'bsi-type-link';

export enum BalancedScorecardItemType {
  DevelopmentGoal = 0,
  MofaGoal = 0,
  Goal = 0,
  Enabler = 0,
  Outcome = 0,
  Theme = 0,
  Operation = 0,
  Objective = 0,
  KPI = 0,
  GenericItem = 0,
  Link = 0,
  UAEVisionGoal = 0,
  ADVisionGoal = 0,
}

export type BalancedScorecardItemTypeKey = keyof typeof BalancedScorecardItemType;

export type ReprotsType = 'Excellence' | 'KPI' | 'Initiatives';

export type RelatedItemType =
  | 'InitiativeItem'
  | 'DevelopmentGoal'
  | 'MofaGoal'
  | 'Goal'
  | 'Enabler'
  | 'Outcome'
  | 'Mission'
  | 'Operation'
  | 'Objective'
  | 'ExcellenceCriteria'
  | 'KPI'
  | 'GenericItem'
  | 'Link';

export type KPIScoringSlug =
  | 'bounded'
  | 'unscored'
  | 'quantitative'
  | 'as-target'
  | 'fixed-target'
  | 'decreasing-better'
  | 'increasing-better';

export enum KPIScoringType {
  Unscored = 0,
  Bounded = 0,
  Quantitative = 0,
  AsTarget = 0,
  FixedTarget = 0,
  DecreasingBetter = 0,
  IncreasingBetter = 0,
}

export enum KPIDataType {
  Currency = 0,
  Percentage = 0,
  Rank = 0,
  Number = 0,
}

export type KPIDataTypeSlug = 'currency' | 'percentage' | 'rank' | 'number';

export type PeriodFrequency =
  // | 'Daily'
  // | 'Weekly'
  // | 'TwoWeeks'
  'Monthly' | 'Quarterly' | 'SemiAnnually' | 'Annually';

export type AggregationType =
  | 'None'
  | 'Sum'
  | 'Average'
  | 'Last'
  | 'Min'
  | 'Max';

export type KpiValueType = 'None' | 'Manual' | 'Calculated' | 'Index';

export interface KPICalendarPeriod {
  id: number | undefined;
  type: PeriodFrequency;
  year: number;
  periodNumber: number;
}

export type PermissionName =
  | 'kpi-reporting:view-all'
  | 'kpi-reporting:submit-report'
  | 'kpi-reporting:review-report'
  | 'kpi-reporting:accept-report'
  | 'excellence-reporting:view-all'
  | 'excellence-reporting:submit-report'
  | 'excellence-reporting:review-report'
  | 'excellence-reporting:accept-report';

export interface Permission {
  id: number;
  name: PermissionName;
}

export type PermissionMap = { [x in PermissionName]?: Permission };

export interface RolePermission {
  id: number;
  permission: Permission;
  permissionId: number;
  roleId: number;
}

export interface Role {
  id: number;
  rolePermissions: RolePermission[];
  slug: string;
  description: string;
  name: TransString;
  organizationId: number;
}

export type RoleSlug =
  | 'bsc-item-owner'
  | 'bsc-item-threshold-updater'
  | 'bsc-item-updater'
  | 'initiative-item-owner'
  | 'initiative-item-updater'
  | 'initiative-item-threshold-updater'
  | 'unit-report-submitter'
  | 'unit-manager';

export enum Roles {
  BscItemOwner = 0,
  BscItemThresholdUpdater = 0,
  BscItemItemUpdater = 0,
  InitiativeItemOwner = 0,
  InitiativeItemThresholdUpdater = 0,
  InitiativeItemUpdater = 0,
  UnitReportSubmitter = 0,
  UnitManager = 0,
}

export interface Setting extends BaseNamed {
  key: string;
  type: KpiSettingType;
  value: string;
  createdDate?: string;
}

export type InitiativeItemSlug = 'initiative' | 'activity';

export enum InitiativeItemType {
  Initiative = 0,
  Activity = 0,
}

export type Status = 'None' | 'Draft' | 'Active' | 'Approved' | 'Deleted';

export type KpiSettingType = 'Boolean' | 'Integer' | 'String';

export type OrganizationUnitUserRole =
  | 'FocalPoint'
  | 'UnitManager'
  | 'ExcellenceManager'
  | 'TopManagerLevel1'
  | 'TopManagerLevel2';

export interface KPILevel {
  value: number;
  slug: string;
  name: TransString;
  id: number;
}

export interface Initiative extends BaseNamed {
  parentId: number;
  unitId: number;
  strategicPlanId: number;
  budget: number | null;
  currencyId: number;
  typeId: number;
  progress: any[];
  userRoles: UserInitiativeItemRole[];
  startDate: string;
  endDate: string;
  status: Status;
  projectCode: string;
  fullTimeEquivalent: string;
  initiativeType: string;
  requireContracting: boolean;
  contractNumber: string;
  projectOutcomes: InitiativeOutcome[];
  initiativeSkills: InitiativeSkill[];
  initiativeLevel: InitiativeLevel;
}

export interface InitiativeOutcome {
  id: number;
  value: string;
}

export interface TreeItemData {
  key: string;
  href?: string | null;
  name: TransString;
  depth: number;
  isExpanded: boolean;
  isActive: boolean;
  hasChildren: boolean;
  clickable?: boolean;
}

export interface InitiativeItemProgress {
  initiativeItemId: number;
  date: string;
  progressPercentage: number;
  budgetSpent: number;
  id: number;
}

export interface DataSeries {
  id: number;
  kpiId?: number;
  kpi?: Kpi;
  year: number;
  periodNumber: number;
  periodFrequency: PeriodFrequency;
  target: number;
  value: number;
}

export interface KPIReports {
  actualValueType: KpiValueType;
  aggregatedTarget: number | null;
  aggregatedValue: number | null;
  dataTypeDesc: string;
  fixedTargetPattern: string;
  kpiDataType: string;
  kpiLevel: string;
  kpiLevelValue: number;
  kpiName: string | null;
  kpiType: string;
  year: number;
  yearlyProgress: number | null;
  performance: number | null;
  performanceColor: string;
  performanceScore: number;
  periodAggregation: PeriodFrequency;
  periodFrequency: PeriodFrequency;
  periodNumber: number;
  scoringType: string;
  targetValueType: KpiValueType;
  unitName: string;
  id: number;
}

export interface ExcellenceReport extends BaseNamed {
  fileType: 'Excel' | 'Pdf' | null;
  language: 'En' | 'Ar' | null;
  ownerUnits: number[] | null;
  pageIndex: number | null;
  pageSize: number | null;
  reportId: number | null;
  responsilbeUnits: number | null;
  sortBy: string | null;
  sortType: SortType | null;
}

export interface Frequencies {
  frequencies:
    | 'Monthly'
    | 'Quarterly'
    | 'SemiAnnually'
    | 'Annually'
    | 'Daily'
    | 'Weekly'
    | 'TwoWeeks';
}

export interface KPIReport {
  aggregationTypes: AggregationType[] | null;
  colors: string[] | null;
  fileType: 'Excel' | 'Pdf' | null;
  frequencies: Frequencies[] | null;
  kpiLevels: InitiativeLevel[] | null;
  kpiTypes: string[] | null;
  language: 'En' | 'Ar' | null;
  organizationId: number;
  pageIndex: number | null;
  pageSize: number | null;
  periodFrequency: PeriodFrequency | null;
  periodNumber: number | null;
  reportId: number | null;
  searchText: string;
  sortBy: string | null;
  sortType: SortType | null;
  units: number[] | null;
  year: number | null;
}

export interface Reports extends BaseNamed {
  sqlQuery: any;
  type: 'KPI' | 'Excellence' | 'Manual';
  params: KPIReport | ExcellenceReport;
}

export interface ObjectPerformance {
  aggregatedTarget: number;
  aggregatedValue: number;
  bestThresholdPct: number;
  highThresholdPct: number;
  lowThresholdPct: number;
  redThresholdPct: number;
  targetThresholdPct: number;
  yellowThresholdPct: number;
  linkedObjectId: number;
  year: number;
  periodNumber: number;
  periodAggregation: PeriodFrequency;
  progressAggregation: PeriodFrequency;
  performance: number;
  performanceColorId: number;
  performanceColor: Lookup;
  performanceScore: number;
  id: number;
}
export interface FrequencyPeriod {
  frequency: PeriodFrequency;
  year: number;
  periodNumber: number;
}

export interface KpiMeasure {
  kpi: Kpi;
  initiativeItems: Initiative[];
  performance: ObjectPerformance[];
}

export interface RelatedItem {
  id: number;
  fromObjectId: number;
  fromObjectType: RelatedItemType;
  fromObjectTitle: TransString;
  toObjectId: number;
  toObjectType: RelatedItemType;
  toObjectTitle: TransString;
}

export interface BalancedScorecardItemWithChildren
  extends BalancedScorecardItem {
  children: BalancedScorecardItemWithChildren[];
}

export interface AppStrategicMapGroup {
  id: number;
  name: TransString;
  columns: AppStrategicMapGroupColumn[];
}

export interface AppStrategicMapGroupItem {
  id: string;
  name: TransString;
}

export interface AppStrategicMapGroupColumn {
  id: number;
  items: AppStrategicMapGroupItem[];
}

export type AppStrategicMapColor =
  | 'Container'
  | 'Link'
  | 'GenericItem'
  | 'KPI'
  | 'Operation'
  | 'Objective'
  | 'Goal'
  | 'DevelopmentGoal'
  | 'MofaGoal'
  | 'Enabler'
  | 'Outcome'
  | 'Theme';

export type AppStrategicMapColors = {
  [x in AppStrategicMapColor]: {
    font: string;
    background: string;
  };
};

export interface AppStrategicMap {
  id: number;
  title: TransString;
  colors: AppStrategicMapColors;
  groups: AppStrategicMapGroup[];
  texts: AppStrategicMapText[];
  images: AppStrategicMapImage[];
}

export interface StrategicMap {
  id: number;
  title: TransString;
  unitId: number;
  strategicPlanId: number;
  strategicMapGroups: StrategicMapGroup[];
  strategicMapImages: AppStrategicMapImage[];
  strategicMapTexts: AppStrategicMapText[];
}

export interface StrategicMapGroup {
  id: number;
  title: TransString;
  columnsCount?: number | null;
  strategicMapItems: StrategicMapItem[];
}

export interface StrategicMapItem {
  columnNo: number;
  balancedScorecardItemId: number;
  balancedScorecardItem: BalancedScorecardItem;
}

export interface KpiDataSeriesPerformance {
  dataSeries: DataSeries;
  performance: ObjectPerformance;
}

export interface BaseDraggableItem {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
  scaleX: number;
  scaleY: number;
}

export interface AppStrategicMapText extends BaseDraggableItem {
  text: string;
}

export interface AppStrategicMapImage extends BaseDraggableItem {
  imageDocumentId: number;
  imageDocument: FileDocument;
}

export type SkillType = 'Generic' | 'Specific';

export interface Skill {
  id: number;
  title: TransString;
  type: SkillType;
}

export type ExcellenceRequirementStatus = 'NotExist' | 'Exist';

export interface ExcellenceRequirement extends BaseNamed {
  requirementStatus: ExcellenceRequirementStatus;
  isEnabled: boolean;
  isCompleted: boolean;
  responsibleUnitId: number;
  responsibleUnit: OrganizationUnit;
  excellenceTheme: ExcellenceTheme;
  excellenceThemeId: number;
  excellenceCriteria: ExcellenceCriteria;
  excellenceCriteriaId: number;
  versionId: string;
  isDefault: boolean;
  startDate: string;
  endDate: string;
  status: any;
  statusColor: Lookup;
  evidences: ExcellenceEvidence[];
  ownerUnit: OrganizationUnit;
  onwerUnitId: number;
}

export interface Evidence {
  id: number;
  year: number;
  periodNumber: number;
  periodFrequency: PeriodFrequency;
  documentId: number;
  document: FileDocument;
}

export interface ExcellenceEvidence extends Evidence {
  excellenceRequirementId: number;
}

export interface KpiEvidence extends Evidence {
  kpiId: number;
}

export interface FileDocument {
  downloadToken: string;
  fileName: string;
  addedDate: string;
  id: number;
}

export interface ExcellenceTheme extends BaseNamed {}

export interface SearchResult<T> {
  metadata: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
  items: T[];
}

export type TaskType =
  | 'ChallengeReview'
  | 'ChallengeResponse'
  | 'ChallengeResponseReview'
  | 'ChallengeEscallationSubmission'
  | 'ChallengeEscallationReview'
  | 'ReportingCycleSetDates'
  | 'DataSeriesSubmitValues'
  | 'DataSeriesReviewValues';

export interface Task extends BaseNamed {
  startDate: string;
  scheduledEndDate: string;
  actualEndDate: string | null;
  assignedUserId: number;
  assignedUser: User;
  challengeId: number;
  challengeActionId: number;
  kpiDataSeriesId: number;
  reportingCycleId: number;
  taskType: TaskType;
}

export interface Dashboard extends BaseNamed {
  rows: DashboardRow[];
}

export interface DashboardRow {
  id: number;
  columns: DashboardColumn[];
}
export interface DashboardColumn {
  id: number;
  flex: number;
  direction: 'row' | 'column';
  widgets: DashboardWidget[];
}

export type DashboardWidget =
  | DashboardPieChartWidget
  | DashboardLineChartWidget
  | DashboardAreaChartWidget;

export interface DashboardPieChartWidget {
  id: number;
  name: TransString;
  description: TransString;
  type: 'pie-chart';
  data: Array<{ label: TransString; value: number }>;
}

export interface DashboardLineChartWidget {
  id: number;
  name: TransString;
  description: TransString;
  label: TransString;
  type: 'line-chart';
  data: Array<{ x: string; y: number }>;
}

export interface DashboardAreaChartWidget {
  id: number;
  name: TransString;
  description: TransString;
  label: TransString;
  type: 'area-chart';
  data: Array<{ x: string; y: number }>;
}

export type ChallengeItemType =
  | 'DevelopmentGoal'
  | 'MofaGoal'
  | 'Goal'
  | 'Enabler'
  | 'Outcome'
  | 'Theme'
  | 'Operation'
  | 'Objective'
  // | 'ExcellenceCriteria'
  | 'KPI'
  | 'GenericItem'
  | 'Link';

export interface Challenge extends BaseNamed {
  affectedUnitId: number;
  affectedUnit: OrganizationUnit;
  challengedUnitId: number;
  challengedUnit: OrganizationUnit;
  itemType: ChallengeItemType;
  balancedScorecardItemId: number;
  balancedScorecardItem: BalancedScorecardItem;
  affectedPeriodYear: number;
  affectedPeriodFrequency: PeriodFrequency;
  affectedPeriodNumer: number;
  status: Status;
  actions: ChallengeAction[];
}

export interface ChallengeAction {
  id: number;
  name: TransString;
  challengedId: number;
  addedByUserId: number;
  addedByUser: User;
  addedDate: string;
  status: Status;
  startDate: string;
  endDate: string;
  comments: Comment[];
}

export interface ScorecardAction {
  id: number;
  name: TransString;
  description: TransString;
  tags: any[];
  unitId: number;
  organizationId: number;
  strategicPlanId: number;
  scorecardItems: any[];
}

export interface Comment {
  id: number;
  text: string;
  addedByUserId: number;
  addedByUser: OrgUser;
  addedDate: string;
  parentId: string;
  excellenceRequirementId: number;
  kpiDataSeriesId: number;
  type: CommentType;
  files: CommentDocument[];
  status: CommentStatus;
}

export type CommentStatus = 'None' | 'Open' | 'Resolved' | 'Canceled';

export type CommentType = 'Comment' | 'ToDo' | 'Evidence';

interface CommentDocument {
  commentId: number;
  documentId: number;
  document: FileDocument;
}

export interface InitiativeSkill {
  id: number;
  initiativeItemId: number;
  initiativeItem?: Initiative;
  skillId: number;
  skill: Skill;
}

export interface RiskManagementItem {
  id: number;
  initiativeId: number;
  initiative: Initiative;
  linkedInitiativeId: number;
  linkedInitiative: Initiative;
  influence: string;
  potentialRiskDesc: string;
  possibility: number;
  impact: number;
  riskIndex: number;
  counterMeasure: string;
  notes: string;
}

export interface ThemeVars {
  headerBg: string;
}

export interface ColorTheme {
  id: number;
  name: TransString;
  vars: ThemeVars;
}

export type ReportingCycleStatus =
  | 'Created'
  | 'Scheduled'
  | 'InProgress'
  | 'InReview'
  | 'Completed'
  | 'Canceled';

export interface ReportingCycle {
  id: number;
  year: number;
  periodFrequency: PeriodFrequency;
  periodNumber: number;
  startDate: string;
  endDate: string;
  actualEndDate: string;
  status: ReportingCycleStatus;
  comment: string;
}

export interface ExtendedInitiativeUpdate {
  activityList: Initiative[];
  initiative: Initiative;
  relatedItemList: RelatedItem[];
  riskManagementList: RiskManagementItem[];
}

export type InitiativeLevel = 'Strategic' | 'Operational';

export interface KPISeriesReportItem {
  id: number;
  kpiDataSeriesId: number;
  kpiDataSeries: DataSeries;
  isSkipped: boolean;
  performances: ObjectPerformance[];
  comments: KpiReportComment[];
}

export type UnitReportStatus =
  | 'None'
  | 'Draft'
  | 'Scheduled'
  | 'Active'
  | 'Submitted'
  | 'PendingOthers'
  | 'Completed'
  | 'CancelledNoData'
  | 'CancelledSkippedCycle'
  | 'Deleted';

export type ReportingCyclePhases =
  | 'None'
  | 'Preparation'
  | 'ReportSubmission'
  | 'ExcellenceManagerSubmission'
  | 'TopManagementLevel1Approval'
  | 'TopManagementLevel2Approval';

export type UnitReportType = 'KPISeries' | 'Excellence';

export interface UnitReport {
  id: number;
  reportingCycleId: number;
  reportingCycle: ReportingCycle;
  unit: OrganizationUnit;
  unitId: number;
  status: UnitReportStatus;
  currentPhase: UnitReportingPhase;
  previousPhase: UnitReportingPhase;
  phases: UnitReportingPhase[];
}

export type UnitReportWorkType = 'Work' | 'Rework';

export interface ReportingCyclePhase {
  id: number;
  phase: ReportingCyclePhases;
}

export interface UnitReportStatusInfo {
  reportingCyclePhaseId: number;
  reportingCyclePhase: ReportingCyclePhase;
  unitReportId: number;
  type: UnitReportWorkType;
  status: UnitReportStatus;
  addTime: string;
  id: number;
  assignedUserId: number;
  assignedUser: OrgUser;
}

export interface KPIReport {
  id: number;
  unitReportId: number;
  unitReport: UnitReport;
  reportItems: KPISeriesReportItem[];
}

export interface BaseComment {
  id: number;
  addedDate: string;
  text: string;
  addedByUserId: number;
  addedByUser: OrgUser;
}

export interface KpiReportComment extends BaseComment {
  kpiSeriesReportItemId: number;
}

export interface UnitReportComment extends BaseComment {
  unitReportId: number;
}

export interface ExcellenceReportItemComment extends BaseComment {
  excellenceReportItemId: number;
}

export interface ExcellenceReportItem {
  id: number;
  excellenceReportId: number;
  excellenceRequirementId: number;
  excellenceRequirement: ExcellenceRequirement;
  comments: ExcellenceReportItemComment[];
}

export interface ExcellenceReport {
  id: number;
  unitReportId: number;
  unitReport: UnitReport;
  reportItems: ExcellenceReportItem[];
}

export type ReportSaveType = 'reject' | 'approve' | 'submit';

export type ReportValidationStatus = 'MissingEvidence' | 'SkippedSeries';

export interface ReportValidationItem {
  status: ReportValidationStatus;
  items: number[];
}

export interface ReportValidation {
  isValid: boolean;
  validation: ReportValidationItem[];
}

export type DashboardType =
  | 'TopManagement'
  | 'UnitDashboard'
  | 'ExcellenceDashboard'
  | 'DGMManagementDashboard';

export interface Dashboard {
  id: number;
  name: TransString;
  organizationId: number;
  organization: Organization;
  unitId: number;
  unit: OrganizationUnit;
  typeId: number;
  type: DashboardType;
  strategicPlan: StrategicPlan;
  strategicPlanId: number;
  kpiCards: KPIDashboardCard[];
  trackingOrgItems: DashboardOrgItem[];
}

export type DashboardItemType = 'KPI' | 'Excellence' | 'Initiative';

export interface DashboardOrgItem {
  id: number;
  unitId: number;
  unit: OrganizationUnit;
  dashboardItemType: DashboardItemType;
  order: number;
  size: string;
}

export interface KPIDashboardCard {
  id: number;
  dashboardId: number;
  kpiId: number;
  kpi: Kpi;
  value: number;
  title: TransString;
  colorId: number;
  color: Lookup;
  iconId: number;
  icon: FileDocument;
  order: number;
}

export interface ReportStatsItem {
  color: string;
  count: number;
  percentage: number;
}

export interface ReportStats {
  organization: Organization;
  unit: OrganizationUnit;
  totalCount: number;
  items: ReportStatsItem[];
}

export interface ListResult<T> {
  items: T[];
}

export interface UserKpiReport {
  unit: OrganizationUnit;
  unitReporting: UnitReport;
  data: UserKpiReportItem[];
  timeline: UnitReportingPhase[];
}

export type UnitReportingPhaseType =
  | 'Submission'
  | 'PendingSubmissionFixes'
  | 'Review'
  | 'Excellence'
  | 'DGMApproval'
  | 'GMApproval';

export interface UnitReportingPhase {
  phase: UnitReportingPhaseType;
  level: number;
  decision: UnitReportingDecision;
  startDate: string;
  expectedEndDate: string;
  actualEndDate5: string;
  members: UnitReportingPhaseUser[];
  submissions: ScorecardSubmission[];
}

interface ScorecardSubmission {
  id: number;
  decision: UnitReportingDecision;
  status: ReportingStatus;
  submissionDate: string;
  comments: Comment[];
}

export type ReportingStatus =
  | 'None'
  | 'Draft'
  | 'Scheduled'
  | 'Active'
  | 'Submitted'
  | 'PendingOthers'
  | 'Completed'
  | 'CancelledNoData'
  | 'CancelledSkippedCycle'
  | 'Deleted';

export interface UnitReportingPhaseUser {
  id: number;
  role: OrganizationUnitUserRole;
  orgUserId: number;
  orgUser: OrgUser;
}

export type UnitReportingDecision =
  | 'None'
  | 'Submitted'
  | 'Approved'
  | 'Rejected'
  | 'OnHold'
  | 'NeedMoreInfo'
  | 'WrongAssignment';

export interface UserKpiReportItem {
  kpi: Kpi;
  items: UserKpiSeriesReport[];
}

export interface UserKpiSeriesReport {
  kpiDataSeries: DataSeries;
  performance: ObjectPerformance;
  yearlyProgress: ObjectPerformance;
}

export interface MyKpiMeasureItem {
  unit: OrganizationUnit;
  items: KpiMeasure[];
}

export interface KPISeriesReport {
  id: number;
  unitReportId: number;
  unitReport: UnitReport;
  reportItems: KPISeriesReportItem[];
}

export interface ScorecardBSCStats {
  totalCount: number;
  items: ScorecardBSCStatsItem[];
}

export interface ScorecardKPIStats {
  totalCount: number;
  items: ScorecardBSCStatsItem[];
}

export interface ScorecardBSCStatsItem {
  type: Lookup;
  count: number;
  percentage: number;
}

export interface ScorecardKPIStatsItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ScorecardStats {
  scorecard: BalancedScorecard;
  scorecardPerformance: ObjectPerformance;
  bscStats: ScorecardBSCStats;
  kpiStats: ScorecardKPIStats;
}

export interface BalancedScorecardItemAllowedParent {
  type: Lookup;
  typeId: number;
  parentType: Lookup;
  parentTypeId: number;
  id: number;
}

export interface KPISeriesReportValidation {
  isValid: boolean;
  validation: KPISeriesReportValidationItem[];
}
export type KPISeriesReportValidationStatus =
  | 'MissingEvidence'
  | 'SkippedSeries';

export interface KPISeriesReportValidationItem {
  status: KPISeriesReportValidationStatus;
  items: number;
}
