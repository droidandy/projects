import {
  Lookup,
  LookupCategory,
  KPIScoringType,
  KPIScoringSlug,
  BalancedScorecardItemType,
  BalancedScorecardItemSlug,
  Role,
  Roles,
  RoleSlug,
  InitiativeItemType,
  InitiativeItemSlug,
  KPIDataType,
  KPIDataTypeSlug,
} from './types';

const KpiScoringMapping: {
  [x in keyof typeof KPIScoringType]: KPIScoringSlug;
} = {
  Unscored: 'unscored',
  Bounded: 'bounded',
  Quantitative: 'quantitative',
  AsTarget: 'as-target',
  FixedTarget: 'fixed-target',
  DecreasingBetter: 'decreasing-better',
  IncreasingBetter: 'increasing-better',
};

export const BalancedScorecardItemMapping: {
  [x in keyof typeof BalancedScorecardItemType]: BalancedScorecardItemSlug;
} = {
  DevelopmentGoal: 'bsi-type-development-goal',
  MofaGoal: 'bsi-type-mofa-goal',
  Goal: 'bsi-type-goal',
  UAEVisionGoal: 'bsi-type-uae-vision-2021',
  ADVisionGoal: 'bsi-type-ad-vision-2030',
  Enabler: 'bsi-type-enabler',
  Outcome: 'bsi-type-outcome',
  Theme: 'bsi-type-theme',
  Objective: 'bsi-type-objective',
  Operation: 'bsi-type-operation',
  GenericItem: 'bsi-type-generic-item',
  KPI: 'bsi-type-kpi',
  Link: 'bsi-type-link',
};

const RoleMapping: {
  [x in keyof typeof Roles]: RoleSlug;
} = {
  BscItemOwner: 'bsc-item-owner',
  BscItemThresholdUpdater: 'bsc-item-threshold-updater',
  BscItemItemUpdater: 'bsc-item-updater',
  InitiativeItemOwner: 'initiative-item-owner',
  InitiativeItemThresholdUpdater: 'initiative-item-threshold-updater',
  InitiativeItemUpdater: 'initiative-item-updater',
  UnitReportSubmitter: 'unit-report-submitter',
  UnitManager: 'unit-manager',
};

const InitiativeItemMapping: {
  [x in keyof typeof InitiativeItemType]: InitiativeItemSlug;
} = {
  Initiative: 'initiative',
  Activity: 'activity',
};

const KPIDataTypeMapping: {
  [x in keyof typeof KPIDataType]: KPIDataTypeSlug;
} = {
  Currency: 'currency',
  Percentage: 'percentage',
  Rank: 'rank',
  Number: 'number',
};

function _mapBySlug<T extends { id: number; slug: string }>(items: T[]) {
  return items.reduce((ret, item) => {
    ret[item.slug] = item.id;
    return ret;
  }, {} as { [x: string]: number });
}

export function initEnums(lookups: Lookup[], roles: Role[]) {
  const init = (
    values: any,
    map: { [x: string]: number },
    mapping: { [x: string]: string }
  ) => {
    Object.entries(mapping).forEach(([name, slug]) => {
      const id = map[slug];
      values[name] = id;
      values[id] = name;
    });
  };
  const initLookup = (
    values: any,
    category: LookupCategory,
    mapping: { [x: string]: string }
  ) => {
    const map = _mapBySlug(lookups.filter(x => x.category === category));
    init(values, map, mapping);
  };

  initLookup(KPIScoringType, 'KPIScoringType', KpiScoringMapping);
  initLookup(
    BalancedScorecardItemType,
    'BalancedScorecardItemType',
    BalancedScorecardItemMapping
  );
  initLookup(
    BalancedScorecardItemType,
    'BalancedScorecardItemType',
    BalancedScorecardItemMapping
  );
  initLookup(InitiativeItemType, 'InitiativeItemType', InitiativeItemMapping);
  initLookup(KPIDataType, 'KPIDataType', KPIDataTypeMapping);
  init(Roles, _mapBySlug(roles), RoleMapping);
}
