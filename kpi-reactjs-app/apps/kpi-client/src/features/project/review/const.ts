import { createForm } from 'typeless-form';
import { ChangeManagementFormSymbol } from '../symbol';

export interface ProjectDetailsFormValues {
  name: string;
  description: string;
  budget: string;
  startDate: Date;
  endDate: Date;
  objectives: string[];
  state: string;
  specs: string[];
  challenges: string[];
  relProjects: string[];
}

export interface UserManagementFormValues {
  owner: string;
  manager: string;
  members: {
    id: number;
    department: string;
    username: string;
    orgUserId: number;
    role: string;
    roleId: number;
  }[];
}

interface ProjectCommunication {
  id: number;
  message: string;
  audience: string;
  channel: string | undefined;
  frequency: string | undefined;
  efficiency: string;
}

interface ProjectMainPhase {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  outcome: string;
  comment: string;
}

export interface ProjectPhasesFromValues {
  mainPhases: ProjectMainPhase[];
  communication: {
    setup: ProjectCommunication[];
    during: ProjectCommunication[];
    post: ProjectCommunication[];
  };
}

interface BudgetPlan {
  id: number;
  activity: string | undefined;
  details: string;
  financialItem: string;
  mainBudget: string;
  extraCost: string;
  totalCost: string;
  paymentProc: string | undefined;
  timeline: Date[];
  comment: string;
}

interface OtherResource {
  id: number;
  activity: string | undefined;
  resource: string | undefined;
  details: string;
  mainBudget: string;
  comment: string;
}

export interface ProjectResourcesFormValues {
  budgetPlans: BudgetPlan[];
  otherResources: OtherResource[];
}

interface RiskManagement {
  id: number;
  activity: string | undefined;
  type: string | undefined;
  description: string;
  probability: number;
  impact: number;
  counterMeasures: string[];
  responsibility: string | undefined;
  timeline: Date[];
}
export interface ProjectRisksFormValues {
  risks: RiskManagement[];
}

interface ChangeManagementValue {
  id: number;
  needForChange: string;
  description: string;
  changeScope: string | undefined;
  affectedParties: string | undefined;
  requiredAction: string[];
  timeline: Date[];
}

export interface ChangeManagementFormValues {
  changeManagements: ChangeManagementValue[];
}