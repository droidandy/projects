import { Trans } from 'react-i18next';
import React from 'react';
import { BenchmarkTargets } from '../const';
import { KpiType, KpiTrend } from '../types';
import { KpiSettingType } from '../types-next';
import { LookupCategory, OrganizationUnitUserRole } from 'shared/types';

export const booleanOptions = [
  { label: <Trans>Yes</Trans>, value: true, filterName: 'Yes' },
  { label: <Trans>No</Trans>, value: false, filterName: 'No' },
];

export const benchmarkOptions = BenchmarkTargets.map(item => ({
  label: item.name,
  value: item.id,
}));

export const ReportsPageOptions = [
  { label: <Trans>Report 1</Trans>, value: 'Report 1' },
  { label: <Trans>Report 2</Trans>, value: 'Report 2' },
  { label: <Trans>Report 3</Trans>, value: 'Report 3' },
  { label: <Trans>Report 4</Trans>, value: 'Report 4' },
];

export const measurementFrequencyOptions = [
  { label: <Trans>Annually</Trans>, value: 'Annually' },
  { label: <Trans>Semi-Annually</Trans>, value: 'SemiAnnually' },
  { label: <Trans>Quarterly</Trans>, value: 'Quarterly' },
  { label: <Trans>Monthly</Trans>, value: 'Monthly' },
];

export const linkedObjectOptions = [
  { label: <Trans>Goal</Trans>, value: 'goal' },
  { label: <Trans>Output</Trans>, value: 'output' },
  { label: <Trans>Mission</Trans>, value: 'mission' },
  { label: <Trans>Operation</Trans>, value: 'operation' },
  { label: <Trans>Initiative</Trans>, value: 'initiative' },
  { label: <Trans>Unit Objective</Trans>, value: 'unitObjective' },
];

export const measurementUnitOptions = [
  { label: <Trans>Percentage</Trans>, value: 'percentage' },
  { label: <Trans>Number</Trans>, value: 'number' },
  { label: <Trans>Rank</Trans>, value: 'rank' },
];

export const measurementMechanismOptions = [
  { label: <Trans>Fixed Value</Trans>, value: 'fixedValue' },
  { label: <Trans>Formula</Trans>, value: 'formula' },
  { label: <Trans>Impacted</Trans>, value: 'impacted' },
];

export const performanceTillDateOptions = [
  { label: <Trans>Last Value</Trans>, value: 'lastValue' },
  { label: <Trans>Sum</Trans>, value: 'sum' },
  { label: <Trans>Average</Trans>, value: 'average' },
  { label: <Trans>Min Value</Trans>, value: 'min' },
  { label: <Trans>Max Value</Trans>, value: 'max' },
];

export const settingTypeOptions: KpiSettingTypeOption[] = [
  { label: <Trans>Boolean</Trans>, value: 'Boolean' },
  { label: <Trans>Integer</Trans>, value: 'Integer' },
  { label: <Trans>String</Trans>, value: 'String' },
];

export interface KpiSettingTypeOption {
  label: any;
  value: KpiSettingType;
}

export interface KpiTypeOption {
  icon: React.ReactNode;
  label: string;
  value: KpiType;
}

export interface OrganizationUnitUserRoleOption {
  label: any;
  value: OrganizationUnitUserRole;
}

export const OrganizationUnitUserRoleOptions: OrganizationUnitUserRoleOption[] = [
  { label: <Trans>FocalPoint</Trans>, value: 'FocalPoint' },
  { label: <Trans>UnitManager</Trans>, value: 'UnitManager' },
  { label: <Trans>ExcellenceManager</Trans>, value: 'ExcellenceManager' },
  { label: <Trans>TopManagerLevel1</Trans>, value: 'TopManagerLevel1' },
  { label: <Trans>TopManagerLevel2</Trans>, value: 'TopManagerLevel2' }
];

export const kpiTypeOptions: KpiTypeOption[] = [
  {
    icon: <i className="flaticon2-hexagonal" />,
    label: 'Board KPI',
    value: 'board',
  },
  {
    icon: <i className="flaticon2-gear" />,
    label: 'Leadership KPI',
    value: 'leadership',
  },
  {
    icon: <i className="flaticon2-photograph" />,
    label: 'Operational KPI',
    value: 'operational',
  },
];

export interface TrendType {
  label: string;
  icon: React.ReactNode;
  value: KpiTrend;
}

export const kpiTrendTypeOptions: TrendType[] = [
  {
    label: 'Increasing Better',
    icon: <i className="flaticon2-arrow-up" />,
    value: 'increasingBetter',
  },
  {
    label: 'As Target',
    icon: <i className="flaticon2-menu-2" />,
    value: 'asTarget',
  },
  {
    label: 'Bounded',
    icon: <i className="flaticon2-cube" />,
    value: 'bounded',
  },
  {
    label: 'Decreasing Better',
    icon: <i className="flaticon2-arrow-down" />,
    value: 'decreasingBetter',
  },
  {
    label: 'Quantitative',
    icon: <i className="flaticon2-rocket-2" />,
    value: 'quantitative',
  },
];

export const challengeItemTypeOptions = [
  { label: <Trans>Goal</Trans>, value: 'goal' },
  { label: <Trans>Output</Trans>, value: 'output' },
  { label: <Trans>Mission</Trans>, value: 'mission' },
  { label: <Trans>Unit Objective</Trans>, value: 'unitObjective' },
  { label: <Trans>Operation</Trans>, value: 'operation' },
  { label: <Trans>Initiative</Trans>, value: 'initiative' },
  { label: <Trans>KPI</Trans>, value: 'kpi' },
  { label: <Trans>Excellence Standard</Trans>, value: 'excellenceStandard' },
  {
    label: <Trans>Excellence Requirement</Trans>,
    value: 'excellenceRequirement',
  },
];

export const periodFrequencyOptions = [
  { label: <Trans>Monthly</Trans>, value: 'Monthly' },
  { label: <Trans>Quarterly</Trans>, value: 'Quarterly' },
  { label: <Trans>Semi-Annually</Trans>, value: 'SemiAnnually' },
  { label: <Trans>Annually</Trans>, value: 'Annually' },
];

export const aggregationTypeOptions = [
  { label: <Trans>None</Trans>, value: 'None' },
  { label: <Trans>Sum</Trans>, value: 'Sum' },
  { label: <Trans>Average</Trans>, value: 'Average' },
  { label: <Trans>Last</Trans>, value: 'Last' },
  { label: <Trans>Min</Trans>, value: 'Min' },
  { label: <Trans>Max</Trans>, value: 'Max' },
];

export const valueTypeOptions = [
  { label: <Trans>None</Trans>, value: 'None' },
  { label: <Trans>Manual</Trans>, value: 'Manual' },
  { label: <Trans>Calculated</Trans>, value: 'Calculated' },
  { label: <Trans>Index</Trans>, value: 'Index' },
];

export const initiativeTypeOptions = [
  { label: <Trans>Limited</Trans>, value: 'Limited' },
  { label: <Trans>Unlimited</Trans>, value: 'Unlimited' },
];

export const statusOptions = [
  { label: <Trans>None</Trans>, value: 'None' },
  { label: <Trans>Draft</Trans>, value: 'Draft' },
  { label: <Trans>Active</Trans>, value: 'Active' },
  { label: <Trans>Approved</Trans>, value: 'Approved' },
  { label: <Trans>Deleted</Trans>, value: 'Deleted' },
];

export const requirementStatusOptions = [
  { label: <Trans>Not Exist</Trans>, value: 'NotExist' },
  { label: <Trans>Exist</Trans>, value: 'Exist' },
];

export const initiativeLevelOptions = [
  { label: <Trans>Strategic</Trans>, value: 'Strategic' },
  { label: <Trans>Operational</Trans>, value: 'Operational' },
];

export const lookupCategoryOptions: LookupCategoryItem[] = [
  { label: <Trans>BalancedScorecardTag</Trans>, value: 'BalancedScorecardTag' },
  { label: <Trans>KPIScoringType</Trans>, value: 'KPIScoringType' },
  { label: <Trans>KPICalendar</Trans>, value: 'KPICalendar' },
  { label: <Trans>KPIDataType</Trans>, value: 'KPIDataType' },
  {
    label: <Trans>BalancedScorecardItemType</Trans>,
    value: 'BalancedScorecardItemType',
  },
  { label: <Trans>InitiativeItemType</Trans>, value: 'InitiativeItemType' },
  { label: <Trans>Currency</Trans>, value: 'Currency' },
];

export interface LookupCategoryItem {
  label: any;
  value: LookupCategory;
}

export const riskOptions = [
  { label: 1, value: 1, filterName: '1' },
  { label: 2, value: 2, filterName: '2' },
  { label: 3, value: 3, filterName: '3' },
  { label: 4, value: 4, filterName: '4' },
  { label: 5, value: 5, filterName: '5' },
];
