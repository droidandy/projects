import * as DateFns from 'date-fns';
import * as R from 'remeda';
import ar from 'date-fns/locale/ar-SA';
import en from 'date-fns/locale/en-US';
import i18n from 'i18next';
import * as Rx from '../rx';
import { GlobalActions, getGlobalState } from '../features/global/interface';
import { ActionLike } from 'typeless';
import {
  SelectOption,
  TransString,
  FrequencyPeriod,
  MeasurementFrequency,
  OrganizationStructure,
  Kpi,
} from '../types';
import React from 'react';
import { DisplayTransString } from '../components/DisplayTransString';
import { UnreachableCaseError } from './helper';
import {
  KPICalendarPeriod,
  DataSeries,
  ObjectPerformance,
  OrganizationUnit,
  KPIScoringType,
  Kpi as KpiNext,
  KPIDataType,
  RelatedItem,
  StrategicMap,
  AppStrategicMap,
  BalancedScorecardItemType,
  ReportingCycle,
} from '../types-next';
import { DefaultStrategicMapColorMap } from 'src/const';
import { useLanguage } from 'src/hooks/useLanguage';

export const catchErrorAndShowModal = () =>
  Rx.catchLog<ActionLike, ActionLike>((e: any) => {
    console.error(e);
    const message = (e.response && e.response.Message) || e.message;
    return Rx.of(GlobalActions.showNotification('error', message));
  });

export function getSelectOption(
  options: SelectOption[],
  value: SelectOption | string | null | boolean | number
) {
  if (!value) {
    return null;
  }
  if (typeof value !== 'object') {
    return options.find(x => x.value === value);
  }
  return value;
}

export function formatDate(date: Date | string, withTime = false) {
  return DateFns.format(
    new Date(date),
    'MM/dd/yyyy' + (withTime ? ' hh:mm' : ''),
    {
      locale: i18n.language === 'ar' ? ar : en,
    }
  );
}

interface LoadAsyncOptionOptions<TSource, TItem, TRefKey> {
  source: TSource | null;
  refKey: TRefKey;
  getAll: () => Rx.Observable<TItem[]>;
  loaded: (items: TItem[]) => any;
  change: (value: any) => any;
}

export function convertToOption<
  T extends { id: string | number; name: TransString }
>(item: T) {
  const { lang, language } = getGlobalState();
  if (!item) {
    return null;
  }
  return {
    label: <DisplayTransString value={item.name} />,
    value: item.id,
    filterName: item.name[lang] || item.name[language],
  };
}

export function loadAsyncOption<
  TSource extends { [x in TRefKey]: string | null },
  TItem extends { id: string; name: TransString },
  TRefKey extends string
>(options: LoadAsyncOptionOptions<TSource, TItem, TRefKey>) {
  const { source, getAll, loaded, change, refKey } = options;
  return getAll().pipe(
    Rx.mergeMap(items => {
      const actions: ActionLike[] = [loaded(items)];
      if (source) {
        const ref = items.find(x => x.id === source[refKey]);
        if (ref) {
          const changeAction = change(convertToOption(ref));
          if (changeAction) {
            actions.push(changeAction);
          }
        }
      }
      return actions;
    })
  );
}

export function loadAsyncOptions<
  TSource extends {
    [x in TRefKey]?:
      | Array<{ id: string; name: TransString } | string>
      | undefined;
  },
  TItem extends { id: string; name: TransString },
  TRefKey extends string
>(options: LoadAsyncOptionOptions<TSource, TItem, TRefKey>) {
  const { source, getAll, loaded, change, refKey } = options;
  const lang = useLanguage();

  return getAll().pipe(
    Rx.mergeMap(items => {
      const actions: ActionLike[] = [loaded(items)];
      const map = R.indexBy(items, x => x.id);
      if (source) {
        const value = source[refKey];
        if (value) {
          actions.push(
            change(
              value
                .map(itemOrId => {
                  const item =
                    typeof itemOrId === 'string' ? map[itemOrId] : itemOrId;
                  if (!item) {
                    return null!;
                  }
                  return {
                    label: <DisplayTransString value={item.name} />,
                    value: item.id,
                    filterName: item.name[lang],
                  };
                })
                .filter(x => x)
            )
          );
        }
      }
      return actions;
    })
  );
}

export const MOBILE = `@media (max-width: 1024px)`;

export function getLinkedKpis(kpi: Kpi, kpis: Kpi[]) {
  const map = R.indexBy(kpis, x => x.id);
  return kpi.linkedKpis!.map(x => map[x]).filter(x => x);
}

export function getPrevPeriod(period: FrequencyPeriod) {
  const copy = { ...period };
  switch (period.frequency) {
    case 'annually':
      return null;
    case 'monthly':
      copy.month!--;
      return copy.month ? copy : null;
    case 'quarterly':
      copy.quarter!--;
      return copy.quarter ? copy : null;
    case 'semi-annually':
      copy.half!--;
      return copy.half ? copy : null;
    default:
      throw new UnreachableCaseError(period.frequency);
  }
}

const frequencyMappingScore = {
  monthly: 1,
  quarterly: 2,
  'semi-annually': 3,
  annually: 4,
};

function _reverseFrequencyScore(score: number) {
  return Object.entries(frequencyMappingScore).find(
    entry => entry[1] === score
  )![0] as MeasurementFrequency;
}

export function getMinKpiFrequency(
  kpi: Kpi,
  allKpis: Kpi[]
): MeasurementFrequency {
  if (kpi.measurement.mechanism !== 'impacted') {
    return kpi.measurement.frequency;
  }
  const linked = getLinkedKpis(kpi, allKpis);
  if (!linked.length) {
    return kpi.measurement.frequency;
  }
  let score = frequencyMappingScore[kpi.measurement.frequency];
  linked.forEach(item => {
    const frequency =
      item.measurement.mechanism === 'impacted'
        ? getMinKpiFrequency(item, allKpis)
        : item.measurement.frequency;
    score = Math.max(score, frequencyMappingScore[frequency]);
  });
  return _reverseFrequencyScore(score);
}

export function getMinFrequencyForKpis(
  kpis: Kpi[],
  allKpis: Kpi[]
): MeasurementFrequency {
  let score = 1;
  kpis.forEach(kpi => {
    const frequency = getMinKpiFrequency(kpi, allKpis);
    score = Math.max(score, frequencyMappingScore[frequency]);
  });
  return _reverseFrequencyScore(score);
}

export function periodToDate(period: FrequencyPeriod) {
  switch (period.frequency) {
    case 'annually':
      return new Date(period.year, 0);
    case 'semi-annually':
      return new Date(period.year, period.half === 1 ? 0 : 6);
    case 'monthly':
      return new Date(period.year, period.month! - 1);
    case 'quarterly':
      return new Date(period.year, period.quarter! * 3 - 1);
    default:
      throw new UnreachableCaseError(period.frequency);
  }
}

export function exhaustSwitch<T extends string, TRet>(
  value: T,
  map: { [x in T]: () => TRet }
): TRet {
  return map[value]();
}

export function getTrans(lang: string, value: TransString) {
  if (!value) {
    return '';
  }
  if (value[lang]) {
    return value[lang];
  }
  return value.ar || value.en;
}

export function formatCalendarPeriod(
  period: KPICalendarPeriod | DataSeries | ObjectPerformance | ReportingCycle
) {
  const type =
    'periodAggregation' in period
      ? period.periodAggregation
      : 'type' in period
      ? period.type
      : period.periodFrequency;
  switch (type) {
    case 'Annually':
      return period.year.toString();
    case 'SemiAnnually':
      return `${period.year} - H${period.periodNumber}`;
    case 'Quarterly':
      return `${period.year} - Q${period.periodNumber}`;
    case 'Monthly':
      return `${period.year}/${period.periodNumber}`;
    default:
      throw new UnreachableCaseError(type);
  }
}

export function dateToInputFormat(date: string) {
  return date ? date.substr(0, 10) : '';
}

export function getKPIPercent(percent: number | null, target: number | null) {
  if (percent == null || target == null) {
    return null;
  }
  return Math.round((percent * target) / 100);
}

export function createOrganizationStructureFromUnit(
  dataset: OrganizationUnit[]
) {
  const hashTable = Object.create(null);
  dataset.forEach(aData => (hashTable[aData.id] = { ...aData, children: [] }));

  const dataTree: OrganizationStructure[] = [];

  dataset.forEach(aData => {
    if (aData.parentId && hashTable[aData.parentId]) {
      hashTable[aData.parentId].children.push(hashTable[aData.id]);
    } else {
      dataTree.push(hashTable[aData.id]);
    }
  });

  return dataTree;
}

export function getKpiPerformanceSuffix(kpi: KpiNext) {
  return kpi.scoringTypeId === KPIScoringType.Bounded ? '' : '%';
}

export const colors = {
  blue: '#5578eb',
  green: '#0abb87',
  yellow: '#ffb822',
  red: '#fd397a',
  gray: '#666',
};

export function formatKpiValue(
  value: number | null | string,
  dataType: KPIDataType,
  useEmpty = false
) {
  if (value == null || value === '') {
    return useEmpty ? '' : 'N/A';
  }
  switch (dataType) {
    case KPIDataType.Percentage:
      return value + '%';
    case KPIDataType.Currency:
      return value + 'AED';
    default:
      return value;
  }
}

export function getRelatedItemKey(item: RelatedItem) {
  return item.toObjectType + '_' + item.toObjectId;
}

export function mapStrategicMap(map: StrategicMap) {
  const ret: AppStrategicMap = {
    id: map.id,
    title: map.title,
    groups: map.strategicMapGroups.map(group => {
      const groups = R.groupBy(group.strategicMapItems, x => x.columnNo);
      return {
        id: group.id,
        name: group.title,
        columns: R.range(1, group.columnsCount! + 1).map(col => ({
          id: col,
          items: (groups[col] || []).map(item => ({
            id: `${
              BalancedScorecardItemType[item.balancedScorecardItem.typeId]
            }_${item.balancedScorecardItemId}`,
            name: item.balancedScorecardItem.name,
          })),
        })),
      };
    }),
    images: map.strategicMapImages.map(item => {
      return {
        id: item.id,
        left: item.left,
        top: item.top,
        width: item.width,
        height: item.height,
        angle: item.angle,
        scaleX: item.scaleX,
        scaleY: item.scaleY,
        imageDocument: item.imageDocument,
        imageDocumentId: item.imageDocumentId,
      };
    }),
    texts: map.strategicMapTexts.map(item => {
      return {
        id: item.id,
        text: item.text,
        left: item.left,
        top: item.top,
        width: item.width,
        height: item.height,
        angle: item.angle,
        scaleX: item.scaleX,
        scaleY: item.scaleY,
      };
    }),
    colors: DefaultStrategicMapColorMap,
  };
  return ret;
}

export const focusFormErrorEpic = () => {
  const errorElement = document.querySelector('[data-error="true"]');
  if (errorElement) {
    errorElement.scrollIntoView();
  }
  return [];
};

export function isNullOrEmpty(str: string | number | null | undefined) {
  return str == null || str === '';
}
