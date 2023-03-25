import { SelectOption } from 'src/types';
export enum Status {
  Draft = 1,
  Active = 2,
  Cancelled = 3,
  Rejected = 4,
  Closed = 5,
  Completed = 6,
}

export enum StatusColor {
  Completed = 'Green',
  InProgress = 'Yellow',
  Late = 'Red',
}
export interface LocalizedString {
  en?: string | null;
  ar?: string | null;
}

export interface Lookup extends LocalizedString {
  id: number;
  category: string;
  slug: string;
}

export interface InitiativeItems {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  code: string | null;
  projectCode: string | null;
  budget: number;
  currencyId: number;
  startDate: Date;
  endDate: Date;
  unitId: number;
  responsibleUnitId: number;
  typeId: number;
  innovativeFactor: string | null;
  status: Status;
}

export interface InitiativeItemPhase {
  id: number;
  initiativeItemId: number;
  name: LocalizedString;
  startDate: Date;
  endDate: Date;
  outcome: number;
  comment: string;
}

export interface ProjectCommunicationPlan {
  id: number;
  type: number;
  initiativeItemId: number;
  message: string;
  targetAudience: string;
  communicationChannelId: number;
  frequencyId: number;
  efficiency: string;
}

export interface ProjectBudgetPlan {
  id: number;
  initiativeItemId: number;
  typeId: number;
  details: string;
  financialItem: LocalizedString;
  mainBudget: number;
  extraCost: number;
  totalCost: number;
  paymentProcedureId: number;
  startDate: Date;
  endDate: Date;
  comment: number;
}

export interface ProjectOtherResource {
  id: number;
  initiativeItemId: number;
  typeId: number;
  resourceId: number;
  details: string;
  mainBudget: number;
  comment: number;
}

export interface ProjectRisk {
  id: number;
  initiativeItemId: number;
  typeId: number;
  riskTypeId: number;
  description: LocalizedString;
  probability: number;
  impact: number;
  counterMeasures: number[];
  responsibilityId: number;
  startDate: Date;
  endDate: Date;
}

export interface ProjectChangeManagement {
  initiativeItemId: number;
  needForChange: LocalizedString;
  description: LocalizedString;
  changeScopeId: number;
  affectedPartiesId: number;
  requiredAction: number[];
  startDate: Date;
  endDate: Date;
}

export interface OrgUser {
  id: number;
  username: string;
  organization: LocalizedString;
}

export interface InitiativeItemUser {
  initiativeItemId: number;
  userOrgId: number;
  roleId: number;
}

export interface InitiativeOptions {
  orgUsers: OrgUser[];
  roles: {
    id: number;
    role: LocalizedString;
  }[];
}

export interface InitiativeFilters {
  unit: SelectOption[];
  type: SelectOption[];
  status: SelectOption[];
}

export interface InitiativeSearchFilter {
  unit: SelectOption;
  type: SelectOption;
  date: (Date | undefined)[];
  status: SelectOption;
}

export interface InitiativeSearchResult {
  cnt: number;
  values: {
    name: LocalizedString;
    unit: LocalizedString;
    users: LocalizedString[];
    budget: number;
    startDate: Date;
    endDate: Date;
    color: StatusColor;
    progressPercentage: number;
    progress: string;
  }[];
}
