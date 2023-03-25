import * as Rx from 'src/rx';
import * as R from 'remeda';
import { BalancedScorecardItemType, KPIScoringType, Kpi } from 'src/types';
import {
  updateKpi,
  deleteDataSeries,
  createDataSeries,
  updateDataSeries,
  createResource,
} from 'shared/API';
import { isKPIScoring4Colors } from 'src/common/utils';
import { getKpiFormState } from './kpi-form';
import { getKpiDetailsState } from './interface';
import { getDataSeries } from 'src/common/kpi';

export function saveKpi() {
  const isAdding = false;
  const formValues = getKpiFormState().values;
  const resource = getKpiDetailsState().kpi;
  const basicInfo = {
    name: {
      en: formValues.name_en,
      ar: formValues.name_ar,
    },
    description: {
      en: formValues.description_en,
      ar: formValues.description_ar,
    },
    parentId: resource.parentId,
    balancedScorecardId: resource.balancedScorecardId,
    responsibleUnitId: formValues.unit.value,
  } as const;

  const values = {
    ...basicInfo,
  };
  const scoringType = formValues.scoringType!.value;
  const kpiValues = {
    status: resource.status,
    typeId: BalancedScorecardItemType.KPI,
    kpiCode: formValues.kpiCode,
    kpiLevelId: formValues.level!.value,
    dataTypeId: formValues.dataType!.value,
    dataTypeDesc: '',
    periodFrequency: formValues.frequency!.value,
    scoringTypeId: scoringType,
    aggregationType: formValues.aggregation!.value,
    actualValueType: formValues.actualValue!.value,
    targetValueType: formValues.goal!.value,
    redThresholdPct: 0,
    yellowThresholdPct: 0,
    targetThresholdPct: 0,
    bestThresholdPct: 0,
    lowThresholdPct: 0,
    highThresholdPct: 0,
    greenInsideBoundaries: formValues.greenInsideBoundaries,
    isSeriesAggregated: formValues.isSeriesAggregated.value,
    maxLimit: formValues.maxLimit,
    dataSeries: (formValues.dataSeries || []).map(idx => {
      return getDataSeries(formValues, idx);
    }),
    // relatedKpis: (formValues.linkedKpis || []).map(id => {
    //   const data: Omit<RelatedKpi, 'relatedKpiName'> = {
    //     relatedKpiId: id,
    //     weight: formValues[getLinkedKpiProp(id, 'weight')],
    //   };
    //   return data;
    // }),
  };
  if (KPIScoringType.Bounded === scoringType) {
    kpiValues.lowThresholdPct = Number(formValues.low);
    kpiValues.highThresholdPct = Number(formValues.high);
  }
  if (isKPIScoring4Colors(scoringType)) {
    kpiValues.yellowThresholdPct = Number(formValues.yellow);
    kpiValues.targetThresholdPct = Number(formValues.target);
    kpiValues.bestThresholdPct = Number(formValues.best);
  }
  Object.assign(values, kpiValues);

  return Rx.defer(() => {
    if (isAdding) {
      return createResource(BalancedScorecardItemType.KPI, values);
    } else {
      const id = resource!.id;
      const newKpi = values as Kpi;
      const kpi = resource as Kpi;
      const newMap = R.indexBy(newKpi.dataSeries, x => x.id);
      const newValues = newKpi.dataSeries.filter(x => !x.id);
      const updatedValues = newKpi.dataSeries.filter(x => x.id);
      const deletedValues = kpi.dataSeries.filter(x => !newMap[x.id]);

      [...deletedValues, ...newValues, ...updatedValues].forEach(item => {
        item.kpiId = kpi.id;
      });

      delete newKpi.dataSeries;
      return Rx.mergeObs(
        Rx.from(deletedValues).pipe(
          Rx.mergeMap(item => deleteDataSeries(item.id))
        ),
        Rx.from(newValues).pipe(Rx.mergeMap(item => createDataSeries(item))),
        Rx.from(updatedValues).pipe(
          Rx.mergeMap(item => updateDataSeries(item.id, item))
        )
      ).pipe(
        Rx.toArray(),
        Rx.mergeMap(() => updateKpi(id, newKpi))
      );
    }
  });
}
