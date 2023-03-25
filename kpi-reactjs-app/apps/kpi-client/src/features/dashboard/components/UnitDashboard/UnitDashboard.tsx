import React from 'react';
import * as R from 'remeda';
import * as Rx from 'src/rx';
import { ValuesWidget } from '../ValuesWidget';
import { Container } from 'src/components/Container';
import { KpiCards } from '../KpiCards';
import { UnitDashboardSymbol } from '../../symbol';
import { createModule } from 'typeless';
import {
  DashboardPerformanceType,
  FrequencyPeriod,
  SelectOption,
  OrganizationUnit,
  ReportStatsWithColor,
  Dashboard,
  Challenge,
  SearchResult,
  DashboardItemType,
} from 'src/types';
import {
  getDashboardState,
  UnitPerformanceMap,
  UnitPerformanceWidget,
} from '../../interface';
import {
  searchKpiPerformanceStats,
  searchExcellencePerformanceStats,
  searchChallenge,
  getResponsibleUnits,
} from 'shared/API';
import { populateReportStats, defaultPeriod } from '../../utils';
import { catchErrorAndShowModal } from 'src/common/utils';
import { TwoColGrid } from '../TwoColGrid';
import { PerformanceBox } from './PerformanceBox';
import { ChallengesWidget } from '../ChallengesWidget/ChallengesWidget';
import { MyTasksWidget } from '../MyTasksWidget';
import { ProjectsWidget } from '../ProjectsWidget/ProjectsWidget';
import { PerformanceWidget } from '../PerformanceWidget/PerformanceWidget';

export interface UnitDashboardState {
  performance: UnitPerformanceMap;
  challenges: {
    period: FrequencyPeriod;
    isLoaded: boolean;
    items: Challenge[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
}

export const [
  handle,
  UnitDashboardActions,
  getUnitDashboardState,
] = createModule(UnitDashboardSymbol)
  .withActions({
    $mounted: null,
    load: null,
    loaded: (
      performance: UnitPerformanceMap,
      challenges: SearchResult<Challenge>,
    ) => ({
      payload: { performance, challenges },
    }),
    changePerformancePeriod: (
      type: DashboardPerformanceType,
      period: FrequencyPeriod
    ) => ({
      payload: { type, period },
    }),
    changeChallengesPeriod: (period: FrequencyPeriod) => ({
      payload: { period },
    }),
    changePerformanceUnit: (
      type: DashboardPerformanceType,
      unit: SelectOption<OrganizationUnit>
    ) => ({
      payload: { type, unit },
    }),
    setPerformanceLoading: (
      type: DashboardPerformanceType,
      isLoading: boolean
    ) => ({
      payload: {
        type,
        isLoading,
      },
    }),
    setChallengesLoading: (isLoading: boolean) => ({
      payload: {
        isLoading,
      },
    }),
    performanceUpdated: (
      type: DashboardPerformanceType,
      stats: ReportStatsWithColor
    ) => ({
      payload: { type, stats },
    }),
    challengesUpdated: (challenges: SearchResult<Challenge>) => ({
      payload: { challenges },
    }),
  })
  .withState<UnitDashboardState>();

export function UnitDashboard() {
  handle();
  const { dashboard } = getDashboardState.useState();
  const isMulti = React.useMemo(() => {
    const groups = R.groupBy(
      dashboard.trackingOrgItems,
      x => x.dashboardItemType
    );
    const kpiCount = groups['KPI' as DashboardItemType].length ?? 0;
    const excellenceCount =
      groups['Excellence' as DashboardItemType].length ?? 0;
    return kpiCount > 1 || excellenceCount > 1;
  }, [dashboard]);
  return (
    <Container>
      <KpiCards />
      {isMulti ? (
        <PerformanceWidget withSize />
      ) : (
        <TwoColGrid>
          <PerformanceBox type="KPI" />
          <PerformanceBox type="Excellence" />
        </TwoColGrid>
      )}
      <TwoColGrid>
        <ChallengesWidget />
        <MyTasksWidget />
      </TwoColGrid>
      <ProjectsWidget />
      <ValuesWidget />
    </Container>
  );
}

function _getPerformance(
  dashboard: Dashboard,
  type: DashboardPerformanceType,
  period: FrequencyPeriod,
  unitId: number | null | undefined
) {
  const units = dashboard.trackingOrgItems
    .filter(x => x.dashboardItemType === type && x.unitId)
    .map(x => x.unitId);

  const search = (criteria: any) => {
    if (type === 'KPI') {
      return searchKpiPerformanceStats(criteria);
    } else {
      return searchExcellencePerformanceStats(criteria);
    }
  };
  const criteria = {
    organizationId: dashboard.organizationId,
    strategicPlanId: dashboard.strategicPlanId,
    periodNumber: period.periodNumber,
    year: period.year,
    periodFrequency: period.frequency,
    unitId: dashboard.unitId,
    responsibleUnits: unitId ? [unitId] : undefined,
    units: (type === 'KPI' && units) ? units : undefined,
    organizationUnitType: 'Division',
    aggregate: (type === 'KPI' && units) ? undefined : true,
  };
  if (type === 'KPI') {
  }
  if (type === 'Excellence') {
    delete criteria.periodNumber;
    delete criteria.year;
    delete criteria.periodFrequency;
  }

  return search(criteria).pipe(
    Rx.mergeMap(([item]) => populateReportStats(period, item)),
    Rx.map(stats => ({
      period,
      stats,
    }))
  );
}

function _getChallenges(
  dashboard: Dashboard,
  period: FrequencyPeriod,
  pageIndex: number
) {
  return searchChallenge({
    organizationId: dashboard.organizationId,
    unitId: dashboard.unitId,
    year: period.year,
    periodFrequency: period.frequency,
    periodNumber: period.periodNumber,
    pageSize: 5,
    pageIndex,
  });
}

handle
  .epic()
  .on(UnitDashboardActions.$mounted, () => UnitDashboardActions.load())
  .on(UnitDashboardActions.load, () => {
    const { dashboard } = getDashboardState();
    return Rx.forkJoin([
      _getPerformance(dashboard, 'KPI', defaultPeriod, null),
      _getPerformance(dashboard, 'Excellence', defaultPeriod, null),
      _getChallenges(dashboard, defaultPeriod, 0),
      getResponsibleUnits({unitId: dashboard.unitId})
    ]).pipe(
      Rx.map(([kpi, excellence, challenges, responsiveUnits]) => {
        const unitOptions: SelectOption<any>[] = [ {label: 'All', value: {id: undefined, }} ];
        unitOptions.push(...responsiveUnits.map( (item) => { return { label: item.name.ar, value: item}; }));
        return UnitDashboardActions.loaded(
          {
            Excellence: {
              ...excellence,
              isLoading: false,
              unit: unitOptions[0],
              unitOptions: unitOptions,
            },
            KPI: {
              ...kpi,
              isLoading: false,
              unit: unitOptions[0],
              unitOptions: unitOptions,
            },
          },
          challenges,
        )
      }),
      catchErrorAndShowModal()
    );
  })
  .onMany(
    [
      UnitDashboardActions.changePerformancePeriod,
      UnitDashboardActions.changePerformanceUnit,
    ],
    ({ type }) => {
      const { dashboard } = getDashboardState();
      const { period, unit } = getUnitDashboardState().performance[type];
      return Rx.concatObs(
        Rx.of(UnitDashboardActions.setPerformanceLoading(type, true)),
        _getPerformance(dashboard!, type, period, unit?.value.id).pipe(
          Rx.map(({ stats }) =>
            UnitDashboardActions.performanceUpdated(type, stats)
          ),
          catchErrorAndShowModal()
        ),
        Rx.of(UnitDashboardActions.setPerformanceLoading(type, false))
      );
    }
  )

  .on(UnitDashboardActions.changeChallengesPeriod, () => {
    const { dashboard } = getDashboardState();
    const { period } = getUnitDashboardState().challenges;
    return Rx.concatObs(
      Rx.of(UnitDashboardActions.setChallengesLoading(true)),
      _getChallenges(dashboard!, period, 0).pipe(
        Rx.map(stats => UnitDashboardActions.challengesUpdated(stats)),
        catchErrorAndShowModal()
      ),
      Rx.of(UnitDashboardActions.setChallengesLoading(false))
    );
  });

const defaultPerformance: UnitPerformanceWidget = {
  period: defaultPeriod,
  isLoading: true,
  unit: null!,
  unitOptions: [],
  stats: {
    color: 'gray',
    performance: 0,
    items: [],
    organization: null!,
    totalCount: 0,
    unit: null!,
  },
};

const initialState: UnitDashboardState = {
  performance: {
    KPI: defaultPerformance,
    Excellence: defaultPerformance,
  },
  challenges: {
    isLoaded: false,
    period: defaultPeriod,
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalCount: 0,
  },
};

handle
  .reducer(initialState)
  .on(UnitDashboardActions.load, state => {
    Object.assign(state, initialState);
  })
  .on(UnitDashboardActions.loaded, (state, { performance, challenges }) => {
    state.performance = performance;
    state.challenges = {
      period: defaultPeriod,
      isLoaded: true,
      items: challenges.items,
      ...challenges.metadata,
    };
  })
  .on(
    UnitDashboardActions.changePerformancePeriod,
    (state, { type, period }) => {
      state.performance[type].period = period;
    }
  )
  .on(UnitDashboardActions.changePerformanceUnit, (state, { type, unit }) => {
    state.performance[type].unit = unit;
  })
  .on(UnitDashboardActions.changeChallengesPeriod, (state, { period }) => {
    state.challenges.period = period;
  })
  .on(
    UnitDashboardActions.setPerformanceLoading,
    (state, { type, isLoading }) => {
      state.performance[type].isLoading = isLoading;
    }
  )
  .on(UnitDashboardActions.performanceUpdated, (state, { type, stats }) => {
    const existing = state.performance[type];
    existing.stats = stats;
  })
  .on(UnitDashboardActions.challengesUpdated, (state, { challenges }) => {
    state.challenges.items = challenges.items;
    state.challenges.pageIndex = challenges.metadata.pageIndex;
    state.challenges.pageSize = challenges.metadata.pageSize;
    state.challenges.totalCount = challenges.metadata.totalCount;
  });
