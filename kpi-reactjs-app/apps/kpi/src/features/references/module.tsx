import { ReferencesActions, ReferencesState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: ReferencesState = {
  unitObjectives: null,
  users: null,
  organizationStructures: null,
  operations: null,
  initiatives: null,
  metrics: null,
  missions: null,
  outputs: null,
  goals: null,
  excellenceStandards: null,
  kpis: null,
  excellenceRequirements: null,
};

handle
  .reducer(initialState)
  .on(ReferencesActions.unitObjectivesLoaded, (state, { unitObjectives }) => {
    state.unitObjectives = unitObjectives;
  })
  .on(ReferencesActions.usersLoaded, (state, { users }) => {
    state.users = users;
  })
  .on(
    ReferencesActions.organizationStructuresLoaded,
    (state, { organizationStructures }) => {
      state.organizationStructures = organizationStructures;
    }
  )
  .on(ReferencesActions.operationsLoaded, (state, { operations }) => {
    state.operations = operations;
  })
  .on(ReferencesActions.initiativesLoaded, (state, { initiatives }) => {
    state.initiatives = initiatives;
  })
  .on(ReferencesActions.metricsLoaded, (state, { metrics }) => {
    state.metrics = metrics;
  })
  .on(ReferencesActions.missionsLoaded, (state, { missions }) => {
    state.missions = missions;
  })
  .on(ReferencesActions.outputsLoaded, (state, { outputs }) => {
    state.outputs = outputs;
  })
  .on(ReferencesActions.goalsLoaded, (state, { goals }) => {
    state.goals = goals;
  })
  .on(
    ReferencesActions.excellenceStandardsLoaded,
    (state, { excellenceStandards }) => {
      state.excellenceStandards = excellenceStandards;
    }
  )
  .on(ReferencesActions.kpisLoaded, (state, { kpis }) => {
    state.kpis = kpis;
  })
  .on(
    ReferencesActions.excellenceRequirementsLoaded,
    (state, { excellenceRequirements }) => {
      state.excellenceRequirements = excellenceRequirements;
    }
  );

export const useReferencesModule = handle;
