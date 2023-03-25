import {
  KPICalendarPeriod,
  DataSeries,
  ObjectPerformance,
  ReportingCycle,
  PeriodFrequency,
  KpiMeasure,
  Kpi,
  KPIScoringType,
  KPIDataType,
} from './types';
import i18next from 'i18next';
import * as R from 'remeda';

export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
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

const frequencySortOrder: { [x in PeriodFrequency]: number } = {
  Monthly: 1,
  Quarterly: 2,
  SemiAnnually: 3,
  Annually: 4,
};

export type MeasurePeriod =
  | {
      key: any;
      period: string;
      type: 'value';
      color: boolean;
    }
  | {
      key: any;
      period: string;
      type: 'target';
      color: boolean;
    }
  | {
      key: any;
      period: any;
      type: null;
      color: boolean;
    };

export function mapMeasureToPeriod(
  measure: KpiMeasure,
  t: i18next.TFunction
): MeasurePeriod[] {
  return R.pipe(
    measure.performance,
    R.sort((a, b) => {
      if (a.periodAggregation !== b.periodAggregation) {
        return (
          frequencySortOrder[a.periodAggregation] -
          frequencySortOrder[b.periodAggregation]
        );
      }
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      if (a.periodNumber === b.periodNumber) {
        if (!a.progressAggregation || !b.progressAggregation) {
          return a.progressAggregation ? 1 : -1;
        }
      }
      return a.periodNumber - b.periodNumber;
    }),
    R.flatMap(item => {
      const period = formatCalendarPeriod(item);
      if (item.progressAggregation) {
        return [
          {
            key: `${period}_progress`,
            period: period + ' ' + t('Yearly Progress'),
            type: null,
            color: false,
          },
        ];
      }

      return [
        {
          key: period,
          period: period + ' ' + t('Value'),
          type: 'value' as const,
          color: false,
        },
        {
          key: period,
          period: period + ' ' + t('Target'),
          type: 'target' as const,
          color: false,
        },
        {
          key: period,
          period,
          type: null,
          color: true,
        },
      ];
    }),
    R.compact
  );
}

export function normalizeMeasures(measures: KpiMeasure[]) {
  if (!measures) {
    return measures;
  }
  const anyQuarterly = measures.some(
    measure => measure.kpi.periodFrequency === 'Quarterly'
  );
  if (!anyQuarterly) {
    return measures;
  }
  return measures.map(measure => {
    if (measure.kpi.periodFrequency === 'SemiAnnually') {
      return {
        ...measure,
        performance: measure.performance.map(perf => ({
          ...perf,
          periodAggregation: 'Quarterly' as PeriodFrequency,
          periodNumber: perf.periodNumber * 2,
        })),
      };
    } else {
      return measure;
    }
  });
}

export function getKpiPerformanceSuffix(kpi: Kpi) {
  return kpi.scoringTypeId === KPIScoringType.Bounded ? '' : '%';
}

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

export function stringifyQueryString(params: Record<string, string | number>) {
  if (!params) {
    return '';
  }
  const keys = Object.keys(params).filter(key => key.length > 0);
  if (!keys.length) {
    return '';
  }
  return (
    '?' +
    keys
      .map(key =>
        params[key] == null
          ? key
          : `${key}=${encodeURIComponent(params[key].toString())}`
      )
      .join('&')
  );
}
