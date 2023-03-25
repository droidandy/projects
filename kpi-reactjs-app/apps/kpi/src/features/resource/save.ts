import * as Rx from 'src/rx';
import * as R from 'remeda';
import {
  BalancedScorecardItemType,
  Roles,
  KPIScoringType,
  DataSeries,
  Kpi,
  RelatedKpi,
  Resource,
} from 'src/types-next';
import {
  updateKpi,
  deleteDataSeries,
  createDataSeries,
  updateDataSeries,
  createResource,
  updateResource,
} from 'src/services/API-next';
import { isKPIScoring4Colors } from 'src/common/helper';
import { formatCalendarPeriod } from 'src/common/utils';
import { getUserBscProp, getPeriodProp, getLinkedKpiProp } from './utils';
import { ResourceFormValues } from './resource-form';

interface SaveResourceOptions {
  draft: boolean;
  parentId: number | null;
  resource: Resource | null;
  isAdding: boolean;
  formValues: ResourceFormValues;
  scorecardId: number;
  type?: any;
}

export function saveResource(options: SaveResourceOptions) {
  const {
    isAdding,
    resource,
    formValues,
    draft,
    parentId,
    scorecardId,
    type
  } = options;
  const basicInfo = {
    name: {
      en: formValues.name_en,
      ar: formValues.name_ar,
    },
    description: {
      en: formValues.description_en,
      ar: formValues.description_ar,
    },
    typeId: type,
    status: draft ? 'Draft' : 'Active',
    parentId,
    balancedScorecardId: scorecardId,
    responsibleUnitId: formValues.unit.value
  } as const;

  const updaters = formValues.updaters || [];
  const focalPoints = formValues.focalPoints || [];

  const userBscRoles = updaters.map(id => {
    const allowUpdatingScoringThreshold = getUserBscProp(
      id,
      'allowUpdatingScoringThreshold'
    );
    return {
      roleId: allowUpdatingScoringThreshold
        ? Roles.BscItemThresholdUpdater
        : Roles.BscItemItemUpdater,
      orgUserId: id,
    };
  });
  focalPoints.forEach(item => {
    userBscRoles.push({
      roleId: Roles.BscItemOwner,
      orgUserId: item.value,
    });
  });
  const values = {
    ...basicInfo,
    userBscRoles,
  };
  if (type === BalancedScorecardItemType.KPI) {
    const scoringType = formValues.scoringType.value;
    const kpiValues = {
      kpiCode: formValues.kpiCode,
      kpiLevelId: formValues.level.value,
      dataTypeId: formValues.dataType.value,
      dataTypeDesc: '',
      periodFrequency: formValues.frequency.value,
      scoringTypeId: scoringType,
      aggregationType: formValues.aggregation.value,
      actualValueType: formValues.actualValue.value,
      targetValueType: formValues.goal.value,
      redThresholdPct: 0,
      yellowThresholdPct: 0,
      targetThresholdPct: 0,
      bestThresholdPct: 0,
      lowThresholdPct: 0,
      highThresholdPct: 0,
      greenInsideBoundaries: formValues.greenInsideBoundaries,
      isSeriesAggregated: formValues.isSeriesAggregated,
      maxLimit: formValues.maxLimit,
      dataSeries: (formValues.periods || []).map(period => {
        const key = formatCalendarPeriod(period);
        const data: DataSeries = {
          id: period.id!,
          periodFrequency: period.type,
          periodNumber: period.periodNumber,
          year: period.year,
          target: formValues[getPeriodProp(key, 'target')],
          value: formValues[getPeriodProp(key, 'value')],
        };
        return data;
      }),
      relatedKpis: (formValues.linkedKpis || []).map(id => {
        const data: Omit<RelatedKpi, 'relatedKpiName'> = {
          relatedKpiId: id,
          weight: formValues[getLinkedKpiProp(id, 'weight')],
        };
        return data;
      }),
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
  }

  return Rx.defer(() => {
    if (isAdding) {
      return createResource(type, values);
    } else {
      const id = resource!.id;
      switch (type) {
        case BalancedScorecardItemType.KPI: {
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
            Rx.from(newValues).pipe(
              Rx.mergeMap(item => createDataSeries(item))
            ),
            Rx.from(updatedValues).pipe(
              Rx.mergeMap(item => updateDataSeries(item.id, { KPIDataSeries: item, GetPerformance: true }))
            )
          ).pipe(
            Rx.toArray(),
            Rx.mergeMap(() => updateKpi(id, newKpi))
          );
        }
        default:
          return updateResource(type, id, values);
      }
    }
  });
}
