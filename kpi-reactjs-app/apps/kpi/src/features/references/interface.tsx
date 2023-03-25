import {
  UnitObjective,
  OrganizationStructure,
  User,
  Operation,
  Initiative,
  Metric,
  Mission,
  Output,
  Goal,
  ExcellenceStandard,
  Kpi,
  ExcellenceRequirement,
} from 'src/types';
import { createModule } from 'typeless';
import { ReferencesSymbol } from './symbol';

// --- Actions ---
export const [handle, ReferencesActions, getReferencesState] = createModule(
  ReferencesSymbol
)
  .withActions({
    unitObjectivesLoaded: (unitObjectives: UnitObjective[]) => ({
      payload: { unitObjectives },
    }),
    usersLoaded: (users: User[]) => ({ payload: { users } }),
    organizationStructuresLoaded: (
      organizationStructures: OrganizationStructure[]
    ) => ({
      payload: { organizationStructures },
    }),
    operationsLoaded: (operations: Operation[]) => ({
      payload: { operations },
    }),
    initiativesLoaded: (initiatives: Initiative[]) => ({
      payload: { initiatives },
    }),
    metricsLoaded: (metrics: Metric[]) => ({ payload: { metrics } }),
    missionsLoaded: (missions: Mission[]) => ({ payload: { missions } }),
    outputsLoaded: (outputs: Output[]) => ({ payload: { outputs } }),
    goalsLoaded: (goals: Goal[]) => ({
      payload: { goals },
    }),
    excellenceStandardsLoaded: (excellenceStandards: ExcellenceStandard[]) => ({
      payload: { excellenceStandards },
    }),
    kpisLoaded: (kpis: Kpi[]) => ({
      payload: { kpis },
    }),
    excellenceRequirementsLoaded: (
      excellenceRequirements: ExcellenceRequirement[]
    ) => ({
      payload: { excellenceRequirements },
    }),
  })
  .withState<ReferencesState>();

// --- Types ---
export interface ReferencesState {
  unitObjectives: UnitObjective[] | null;
  users: User[] | null;
  organizationStructures: OrganizationStructure[] | null;
  operations: Operation[] | null;
  initiatives: Initiative[] | null;
  metrics: Metric[] | null;
  missions: Mission[] | null;
  outputs: Output[] | null;
  goals: Goal[] | null;
  excellenceStandards: ExcellenceStandard[] | null;
  excellenceRequirements: ExcellenceRequirement[] | null;
  kpis: Kpi[] | null;
}
