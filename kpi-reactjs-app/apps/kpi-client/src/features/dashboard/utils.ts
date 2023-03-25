import {
  ReportStats,
  FrequencyPeriod,
  ReportStatsWithColor,
  ChartColor,
  Dashboard,
  DashboardPerformanceType,
  SelectOption,
} from 'src/types';
import * as Rx from 'src/rx';
import {
  getObjectPerformance,
  searchKpiPerformanceStats,
  searchExcellencePerformanceStats,
} from 'shared/API';
import { PerformanceItem } from './interface';

export function populateReportStats(
  period: FrequencyPeriod,
  item: ReportStats
) {
  item.items.forEach(sub => {
    if (!sub.color) {
      sub.color = 'gray';
    }
  });
  const criteria: any = {
    period: period.periodNumber,
    year: period.year,
    periodAggregation: period.frequency,
  };
  if (item.unit) {
    criteria.unitId = item.unit.id;
  } else {
    criteria.orgId = item.organization.id;
  }
  return getObjectPerformance(criteria).pipe(
    Rx.map(([perf]) => {
      const stats: ReportStatsWithColor = {
        ...item,
        performance: perf ? perf.performance : 0,
        color:
          perf && perf.performanceColor
            ? (perf.performanceColor.slug as ChartColor)
            : 'gray',
      };
      return stats;
    })
  );
}

export const defaultPeriod: FrequencyPeriod = {
  frequency: 'Annually',
  periodNumber: 1,
  year: new Date().getFullYear(),
};

export const defaultPerformance: PerformanceItem = {
  period: defaultPeriod,
  isLoading: true,
  items: [],
  overall: {
    color: 'gray',
    performance: 0,
    items: [],
    organization: null!,
    totalCount: 0,
    unit: null!,
  },
};

export function getPerformance(
  dashboard: Dashboard,
  type: DashboardPerformanceType,
  period: FrequencyPeriod
) {
  const units = dashboard.trackingOrgItems
    .filter(x => x.dashboardItemType === type && x.unitId)
    .map(x => x.unitId);

  const baseCriteria = {
    organizationId: dashboard.organizationId,
    strategicPlanId: dashboard.strategicPlanId,
    periodNumber: period.periodNumber,
    year: period.year,
    periodFrequency: period.frequency,
    organizationUnitType: 'Division',
  };
  if (type === 'Excellence') {
    delete baseCriteria.year;
    delete baseCriteria.periodNumber;
    delete baseCriteria.periodFrequency;
  }
  const search = (units?: number[] | undefined) => {
    const criteria: any = {
      ...baseCriteria,
    };
    if (units) {
      return Rx.forkJoin(
        units.map( (item, index) => {
          const criteria: any = {
            ...baseCriteria,
          };
          if (index === 0) {
            criteria.units = [item];
          }
          else {
            criteria.responsibleUnits = [item];
          }
          if (type === 'KPI') {
            return searchKpiPerformanceStats({...criteria});
          } else {
            return searchExcellencePerformanceStats({...criteria});
          }
        })
      ).pipe(
        Rx.map( items => items.map( item => item[0]) )
      );
      
    } else {
      criteria.aggregate = true;
    }
    if (type === 'KPI') {
      return searchKpiPerformanceStats(criteria);
    } else {
      return searchExcellencePerformanceStats(criteria);
    }
  };

  return Rx.forkJoin([
    Rx.defer(() => {
      if (!units.length) {
        return Rx.of([]);
      } else {
        return search(units);
      }
    }),
    search(),
  ]).pipe(
    Rx.mergeMap(([items, [overall]]) =>
      Rx.from([...items, overall]).pipe(
        Rx.mergeMap(item => populateReportStats(period, item)),
        Rx.toArray()
      )
    ),
    Rx.map(allItems => {
      const overall = allItems.find(x => !x.unit)!;
      const items = allItems.filter(x => x.unit);
      return {
        period,
        overall,
        items,
        isLoading: false,
      } as PerformanceItem;
    })
  );
}
