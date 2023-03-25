import React from 'react';
import { useTranslation } from 'react-i18next';
import { PerformanceData } from './PerformanceData';
import { Tabs, Tab } from '../Tabs';
import {
  PerformanceMap,
  PerformanceItem,
  getDashboardState,
} from '../../interface';
import { DashboardPerformanceType, FrequencyPeriod } from 'src/types';
import { PerformanceWidgetSymbol } from '../../symbol';
import { createModule } from 'typeless';
import * as Rx from 'src/rx';
import { getPerformance, defaultPeriod, defaultPerformance } from '../../utils';
import { catchErrorAndShowModal } from 'src/common/utils';
import { PerformanceDataWithSize } from './PerformanceDataWithSize';

export interface PerformanceWidgetState {
  performance: PerformanceMap;
}

export const [
  handle,
  PerformanceWidgetActions,
  getPerformanceWidgetState,
] = createModule(PerformanceWidgetSymbol)
  .withActions({
    $mounted: null,
    load: null,
    loaded: (performance: PerformanceMap) => ({
      payload: { performance },
    }),
    changePerformancePeriod: (
      type: DashboardPerformanceType,
      period: FrequencyPeriod
    ) => ({
      payload: { type, period },
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
    performanceUpdated: (
      type: DashboardPerformanceType,
      performance: PerformanceItem
    ) => ({
      payload: { type, performance },
    }),
  })
  .withState<PerformanceWidgetState>();

interface PerformanceWidgetProps {
  withSize?: boolean;
}

export function PerformanceWidget(props: PerformanceWidgetProps) {
  const { withSize } = props;

  handle();
  const { t } = useTranslation();
  const [index, setIndex] = React.useState(0);
  return (
    <Tabs
      selectedTab={index}
      onIndexChange={(value: number) => setIndex(value)}
    >
      <Tab title={t('Unit KPI Performance')}>
        {withSize ? (
          <PerformanceDataWithSize type="KPI" key={index.toString()} />
        ) : (
          <PerformanceData type="KPI" key={index.toString()} />
        )}
      </Tab>
      <Tab title={t('Unit Excellence Performance')}>
        {withSize ? (
          <PerformanceDataWithSize type="Excellence" key={index.toString()} />
        ) : (
          <PerformanceData type="Excellence" key={index.toString()} />
        )}
      </Tab>
    </Tabs>
  );
}

handle
  .epic()
  .on(PerformanceWidgetActions.$mounted, () => PerformanceWidgetActions.load())
  .on(PerformanceWidgetActions.load, () => {
    const { dashboard } = getDashboardState();
    return Rx.forkJoin([
      getPerformance(dashboard, 'KPI', defaultPeriod),
      getPerformance(dashboard, 'Excellence', defaultPeriod),
    ]).pipe(
      Rx.map(([kpi, excellence]) =>
        PerformanceWidgetActions.loaded({
          Excellence: excellence,
          KPI: kpi,
        })
      ),
      catchErrorAndShowModal()
    );
  })
  .on(PerformanceWidgetActions.changePerformancePeriod, ({ type, period }) => {
    const { dashboard } = getDashboardState();
    return Rx.concatObs(
      Rx.of(PerformanceWidgetActions.setPerformanceLoading(type, true)),
      getPerformance(dashboard!, type, period).pipe(
        Rx.map(ret => PerformanceWidgetActions.performanceUpdated(type, ret)),
        catchErrorAndShowModal()
      ),
      Rx.of(PerformanceWidgetActions.setPerformanceLoading(type, false))
    );
  });

const initialState: PerformanceWidgetState = {
  performance: {
    KPI: defaultPerformance,
    Excellence: defaultPerformance,
  },
};

handle
  .reducer(initialState)
  .on(PerformanceWidgetActions.load, state => {
    Object.assign(state, initialState);
  })
  .on(PerformanceWidgetActions.loaded, (state, { performance }) => {
    state.performance = performance;
  })
  .on(
    PerformanceWidgetActions.changePerformancePeriod,
    (state, { type, period }) => {
      state.performance[type].period = period;
    }
  )
  .on(
    PerformanceWidgetActions.setPerformanceLoading,
    (state, { type, isLoading }) => {
      state.performance[type].isLoading = isLoading;
    }
  )
  .on(
    PerformanceWidgetActions.performanceUpdated,
    (state, { type, performance }) => {
      const existing = state.performance[type];
      existing.items = performance.items;
      existing.overall = performance.overall;
    }
  );
