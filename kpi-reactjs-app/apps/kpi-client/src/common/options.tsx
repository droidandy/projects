import React from 'react';
import { Trans } from 'react-i18next';
import { PeriodFrequency, SelectOption } from 'src/types';

export const measurementFrequencyOptions = [
  { label: <Trans>Annually</Trans>, value: 'Annually' },
  { label: <Trans>Semi-Annually</Trans>, value: 'SemiAnnually' },
  { label: <Trans>Quarterly</Trans>, value: 'Quarterly' },
  { label: <Trans>Monthly</Trans>, value: 'Monthly' },
];

export const frequencyOptions: SelectOption<PeriodFrequency>[] = [
  { label: <Trans>Annually</Trans>, value: 'Annually' },
  { label: <Trans>Semi-Annually</Trans>, value: 'SemiAnnually' },
  { label: <Trans>Quarterly</Trans>, value: 'Quarterly' },
];

export const documentOptions = [
  { label: <Trans>Excel</Trans>, value: 'Excel' },
  { label: <Trans>Pdf</Trans>, value: 'Pdf' },
];

export const colorOptions = [
  { label: <Trans>Blue</Trans>, value: 'blue' },
  { label: <Trans>Green</Trans>, value: 'green' },
  { label: <Trans>Yellow</Trans>, value: 'yellow' },
  { label: <Trans>Red</Trans>, value: 'red' },
  { label: <Trans>Gray</Trans>, value: 'gray' },
];

export const aggregationTypeOptions = [
  { label: <Trans>None</Trans>, value: 'None' },
  { label: <Trans>Sum</Trans>, value: 'Sum' },
  { label: <Trans>Average</Trans>, value: 'Average' },
  { label: <Trans>Last</Trans>, value: 'Last' },
  { label: <Trans>Min</Trans>, value: 'Min' },
  { label: <Trans>Max</Trans>, value: 'Max' },
];

export const reportsTypeOptions = [
  { label: <Trans>Excellence</Trans>, value: 'Excellence' },
  { label: <Trans>KPI</Trans>, value: 'KPI' },
  { label: <Trans>Initiatives</Trans>, value: 'Initiatives' },
];

export const kpiLevelOptions = [
  { label: <Trans>Strategic</Trans>, value: 'Strategic' },
  { label: <Trans>Operational</Trans>, value: 'Operational' },
];

export const kpiStatusOptions = [
  { label: <Trans>Active</Trans>, value: 'Active' },
  { label: <Trans>Archived</Trans>, value: 'Archived' },
];

export const valueTypeOptions = [
  { label: <Trans>None</Trans>, value: 'None' },
  { label: <Trans>Manual</Trans>, value: 'Manual' },
  { label: <Trans>Calculated</Trans>, value: 'Calculated' },
  { label: <Trans>Index</Trans>, value: 'Index' },
];

export const boolOptions = [
  { label: <Trans>Yes</Trans>, value: true },
  { label: <Trans>No</Trans>, value: false },
];

export const requirementStatusOptions = [
  { label: <Trans>Not Exist</Trans>, value: 'NotExist' },
  { label: <Trans>Exist</Trans>, value: 'Exist' },
];
