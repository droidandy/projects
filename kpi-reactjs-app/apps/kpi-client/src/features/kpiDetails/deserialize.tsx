import { Resource, KPIScoringType, Kpi, OrganizationUnit } from 'src/types';
import { getGlobalState } from '../global/interface';
import React from 'react';
import { convertToOption, isKPIScoring4Colors } from 'src/common/utils';
import { DisplayTransString } from 'src/components/DisplayTransString';
import {
  frequencyOptions,
  aggregationTypeOptions,
  valueTypeOptions,
  boolOptions,
} from 'src/common/options';
import { KpiFormValues, serializeDataSeries } from 'src/common/kpi';

export function deserializeResource(
  resource: Resource | null,
  unit: OrganizationUnit
): KpiFormValues {
  if (!resource) {
    return {} as KpiFormValues;
  }
  const { lookups, kpiLevels } = getGlobalState();
  const type = lookups.find(x => x.id === resource.typeId)!;

  const getKPIData = () => {
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
    // const periods = kpi.dataSeries.map(item => {
    //   const mapped: KPICalendarPeriod = {
    //     id: item.id,
    //     periodNumber: item.periodNumber,
    //     type: item.periodFrequency,
    //     year: item.year,
    //   };
    //   return { mapped, original: item };
    // });
    const kpiValues = {
      kpiCode: kpi.kpiCode,
      yellow: 0,
      target: 0,
      best: 0,
      low: 0,
      high: 0,
      level: kpiLevel && convertToOption(kpiLevel),
      dataType: getLookupValue(kpi.dataTypeId),
      frequency: frequencyOptions.find(x => x.value === kpi.periodFrequency),
      scoringType: getLookupValue(kpi.scoringTypeId),
      aggregation: aggregationTypeOptions.find(
        x => kpi.aggregationType === x.value
      ),
      actualValue: valueTypeOptions.find(x => x.value === kpi.actualValueType),
      goal: valueTypeOptions.find(x => x.value === kpi.targetValueType),
      greenInsideBoundaries: kpi.greenInsideBoundaries,
      isSeriesAggregated: boolOptions.find(
        x => x.value === kpi.isSeriesAggregated
      )!,
      maxLimit: kpi.maxLimit,
      dataSeries: kpi.dataSeries.map((_, i) => i),
      ...kpi.dataSeries.reduce((ret, item, i) => {
        Object.assign(ret, serializeDataSeries(i, item));
        return ret;
      }, {} as any),
      // linkedKpis: kpi.relatedKpis.map(x => x.relatedKpiId),
      // ...kpi.relatedKpis.reduce((ret, item) => {
      //   ret[getLinkedKpiProp(item.relatedKpiId, 'weight')] = item.weight;
      //   ret[getLinkedKpiProp(item.relatedKpiId, 'name')] = item.relatedKpiName;
      //   return ret;
      // }, {} as { [x: string]: any }),
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

  return {
    ...getKPIData(),
    name_ar: resource.name.ar,
    name_en: resource.name.en,
    description_ar: resource.description.ar,
    description_en: resource.description.en,
    type: {
      label: <DisplayTransString value={type} />,
      value: resource.typeId,
    },
    unit: {
      label: <DisplayTransString value={unit.name} />,
      value: unit.id,
    },
  };
}
