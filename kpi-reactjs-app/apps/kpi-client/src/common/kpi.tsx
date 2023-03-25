import {
  SelectOption,
  PeriodFrequency,
  KPIScoringType,
  DataSeries,
  Kpi,
  BalancedScorecardItemType,
} from 'src/types';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import {
  validateString,
  validateOption,
  validateNumber,
  validateMax,
  validateMin,
  isKPIScoring4Colors,
  validateLangString,
} from 'src/common/utils';
import {
  createResource,
  deleteDataSeries,
  createDataSeries,
  updateDataSeries,
  updateKpi,
} from 'shared/API';

export interface KpiFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  unit: SelectOption;
  parent: SelectOption;
  scorecard: SelectOption;

  kpiCode: string;
  level: SelectOption | null | undefined;
  scoringType: SelectOption | null | undefined;
  dataType: SelectOption | null | undefined;
  frequency: SelectOption<PeriodFrequency> | null | undefined;
  aggregation: SelectOption | null | undefined;
  actualValue: SelectOption | null | undefined;
  goal: SelectOption | null | undefined;
  low: number;
  high: number;
  yellow: number;
  target: number;
  best: number;
  greenInsideBoundaries: boolean;
  dataSeries: number[];
  // linkedKpis: number[];
  isSeriesAggregated: SelectOption<boolean>;
  maxLimit: number;

  [x: string]: any;
}

const dataSeriesKeys = [
  'target',
  'value',
  'id',
  'periodFrequency',
  'year',
  'periodNumber',
] as const;

export function getDataSeriesProp(key: number, prop: string) {
  return `data-series_${key}_${prop}`;
}

export function getDataSeries(values: KpiFormValues, key: number): DataSeries {
  const dataSeries = dataSeriesKeys.reduce((ret, prop) => {
    ret[prop] = values[getDataSeriesProp(key, prop)];
    return ret;
  }, {} as any) as DataSeries;
  if (typeof dataSeries.target === 'string') {
    dataSeries.target = Number(dataSeries.target);
  }
  return dataSeries;
}

export function serializeDataSeries(key: number, dataSeries: DataSeries) {
  return dataSeriesKeys.reduce((ret, prop) => {
    ret[getDataSeriesProp(key, prop as any)] = dataSeries[prop];
    return ret;
  }, {} as any);
}

export function validateKpiForm(
  errors: any,
  values: KpiFormValues,
  isNew = false
) {
  validateLangString(errors, values, 'name');
  validateLangString(errors, values, 'description');
  validateOption(errors, values, 'unit');

  // const actualValue = values.actualValue
  //   ? (values.actualValue.value as KpiValueType)
  //   : null;

  validateString(errors, values, 'kpiCode');
  validateOption(errors, values, 'level');
  validateOption(errors, values, 'scoringType');
  validateOption(errors, values, 'dataType');
  validateOption(errors, values, 'frequency');
  validateOption(errors, values, 'aggregation');
  validateOption(errors, values, 'actualValue');
  validateOption(errors, values, 'goal');
  validateOption(errors, values, 'isSeriesAggregated');
  validateNumber(errors, values, 'maxLimit', true);
  validateMax(errors, values, 'maxLimit', 100);
  validateMin(errors, values, 'maxLimit', 0);

  const scoringType = values.scoringType ? values.scoringType.value : 0;
  if (isKPIScoring4Colors(scoringType)) {
    validateNumber(errors, values, 'yellow');
    validateNumber(errors, values, 'target');
    validateNumber(errors, values, 'best');
  }
  if (KPIScoringType.Bounded === scoringType) {
    validateNumber(errors, values, 'low');
    validateNumber(errors, values, 'high');
  }

  if (isNew) {
    validateOption(errors, values, 'scorecard');
  }

  // if (actualValue === 'Index') {
  //   const linkedKpis = values.linkedKpis || [];
  //   if (!linkedKpis.length) {
  //     errors.linkedKpis = i18n.t('Select at least 1 KPI');
  //   } else {
  //     const total = linkedKpis.reduce(
  //       (sum, id) => sum + Number(values[getLinkedKpiProp(id, 'weight')]),
  //       0
  //     );
  //     if (total !== 100) {
  //       errors.linkedKpis = i18n.t('Total weight must be 100');
  //     }
  //   }
  // }
}

export function saveKpi(formValues: KpiFormValues, resource: Kpi | null) {
  const isAdding = resource === null;
  const getRefIds = () => {
    if (resource) {
      return {
        parentId: resource.parentId,
        balancedScorecardId: resource.balancedScorecardId,
      };
    }
    if (
      !formValues.parent ||
      (typeof formValues.parent.value === 'string' &&
        formValues.parent.value.startsWith('root'))
    ) {
      return {
        balancedScorecardId: formValues.scorecard.value,
        parentId: null,
      };
    }
    return {
      balancedScorecardId: formValues.scorecard.value,
      parentId: formValues.parent.value,
    };
  };

  const basicInfo = {
    ...getRefIds(),
    name: {
      en: formValues.name_en,
      ar: formValues.name_ar,
    },
    description: {
      en: formValues.description_en,
      ar: formValues.description_ar,
    },
    responsibleUnitId: formValues.unit.value,
  } as const;

  const values = {
    ...basicInfo,
  };
  const scoringType = formValues.scoringType!.value;
  const kpiValues = {
    status: resource ? resource.status : undefined,
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
