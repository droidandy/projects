import * as R from 'remeda';
import {
  Resource,
  KPIScoringType,
  Roles,
  BalancedScorecardItemType,
  Kpi,
  KPICalendarPeriod,
} from 'src/types-next';
import { getGlobalState } from '../global/interface';
import React from 'react';
import { getReferencesNextState } from '../referencesNext/interface';
import { convertToOption, formatCalendarPeriod } from 'src/common/utils';
import { isKPIScoring4Colors } from 'src/common/helper';
import { DisplayTransString } from 'src/components/DisplayTransString';
import {
  periodFrequencyOptions,
  aggregationTypeOptions,
  valueTypeOptions,
} from 'src/common/options';
import { getLinkedKpiProp } from './utils';
import { ResourceFormValues } from './resource-form';

export function deserializeResource(
  resource: Resource | null
): ResourceFormValues {
  if (!resource) {
    return {} as ResourceFormValues;
  }
  const { lookups, kpiLevels, organizationUnits } = getGlobalState();
  const type = lookups.find(x => x.id === resource.typeId)!;
  const {
    users: { users },
    scorecards: { scorecards },
  } = getReferencesNextState();
  const userMap = R.indexBy(users, x => x.id);
  const userToOption = (id: number) => ({
    label: <DisplayTransString value={userMap[id] && userMap[id].name} />,
    value: id,
  });
  const scorecard = scorecards.find(x => x.id === resource.balancedScorecardId);
  const updaters = resource.userBscRoles.filter(
    x =>
      x.roleId === Roles.BscItemItemUpdater ||
      x.roleId === Roles.BscItemThresholdUpdater
  );
  const updatersData = updaters.reduce((ret, item) => {
    const prefix = `user_${item.orgUserId}_`;
    ret[prefix + 'allowUpdatingScoringThreshold'] =
      item.roleId === Roles.BscItemThresholdUpdater;
    return ret;
  }, {} as { [x: string]: any });
  const getKPIData = () => {
    if (resource.typeId !== BalancedScorecardItemType.KPI) {
      return {};
    }
    const getLookupValue = (id: number) => {
      const lookup = lookups.find(x => x.id === id);
      if (!lookup) {
        return null;
      }
      return {
        label: <DisplayTransString value={lookup} />,
        value: id,
      };
    };
    const kpi = resource as Kpi;
    const kpiLevel = kpiLevels.find(x => x.id === kpi.kpiLevelId);
    const periods = kpi.dataSeries.map(item => {
      const mapped: KPICalendarPeriod = {
        id: item.id,
        periodNumber: item.periodNumber,
        type: item.periodFrequency,
        year: item.year,
      };
      return { mapped, original: item };
    });
    const kpiValues = {
      kpiCode: kpi.kpiCode,
      yellow: 0,
      target: 0,
      best: 0,
      low: 0,
      high: 0,
      level: kpiLevel && convertToOption(kpiLevel),
      maxLevel: kpi.maxLevel,
      dataType: getLookupValue(kpi.dataTypeId),
      frequency: periodFrequencyOptions.find(
        x => x.value === kpi.periodFrequency
      ),
      scoringType: getLookupValue(kpi.scoringTypeId),
      aggregation: aggregationTypeOptions.find(
        x => kpi.aggregationType === x.value
      ),
      actualValue: valueTypeOptions.find(x => x.value === kpi.actualValueType),
      goal: valueTypeOptions.find(x => x.value === kpi.targetValueType),
      periods: periods.map(x => x.mapped),
      greenInsideBoundaries: kpi.greenInsideBoundaries,
      isSeriesAggregated: kpi.isSeriesAggregated,
      ...periods.reduce((ret, item) => {
        const key = formatCalendarPeriod(item.mapped);
        const prefix = `period_${key}_`;
        ret[`${prefix}target`] = item.original.target;
        ret[`${prefix}value`] = item.original.value;
        return ret;
      }, {} as { [x: string]: any }),
      linkedKpis: kpi.relatedKpis.map(x => x.relatedKpiId),
      ...kpi.relatedKpis.reduce((ret, item) => {
        ret[getLinkedKpiProp(item.relatedKpiId, 'weight')] = item.weight;
        ret[getLinkedKpiProp(item.relatedKpiId, 'name')] = item.relatedKpiName;
        return ret;
      }, {} as { [x: string]: any }),
    };

    if (KPIScoringType.Bounded === kpi.scoringTypeId) {
      kpiValues.low = kpi.lowThresholdPct;
      kpiValues.high = kpi.highThresholdPct;
    }
    if (isKPIScoring4Colors(kpi.scoringTypeId)) {
      kpiValues.yellow = kpi.yellowThresholdPct;
      kpiValues.target = kpi.targetThresholdPct;
      kpiValues.best = kpi.bestThresholdPct;
    }
    return kpiValues;
  };
  const orgUnit = organizationUnits!.find(el => {
    return el.id == resource.responsibleUnitId;
  });

  return {
    name_ar: resource.name.ar,
    name_en: resource.name.en,
    scorecard: scorecard
      ? {
          label: <DisplayTransString value={scorecard.name} />,
          value: scorecard.id,
        }
      : {},
    description_ar: resource.description.ar,
    description_en: resource.description.en,
    type: {
      label: <DisplayTransString value={type} />,
      value: resource.typeId,
    },
    focalPoints: resource.userBscRoles
      .filter(x => x.roleId === Roles.BscItemOwner)
      .map(x => userToOption(x.orgUserId)),
    updaters: updaters.map(x => x.orgUserId),
    ...updatersData,
    ...getKPIData(),
    unit: {
      label: <DisplayTransString value={orgUnit.name} />,
      value: orgUnit.id,
    },
  } as ResourceFormValues;
}
