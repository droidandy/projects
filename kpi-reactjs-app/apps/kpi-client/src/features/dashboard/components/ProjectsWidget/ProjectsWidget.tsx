import React from 'react';
import { getDashboardState } from '../../interface';
import {
  FrequencyPeriod,
  ReportStats,
  Dashboard,
  OrganizationUnit,
  SelectOption,
} from 'src/types';
import { ProjectsWidgetSymbol } from '../../symbol';
import { createModule } from 'typeless';
import * as Rx from 'src/rx';
import { catchErrorAndShowModal } from 'src/common/utils';
import { Widget } from './Widget';
import { searchInitiativeStats, searchOrganizationUnit } from 'shared/API';
import { defaultPeriod } from '../../utils';
import { getGlobalState } from 'src/features/global/interface';

export interface ProjectsWidgetState {
  period: FrequencyPeriod;
  isLoading: boolean;
  stats: ReportStats[];
  units: OrganizationUnit[];
  unit: SelectOption<OrganizationUnit> | null;
}

export const [
  handle,
  ProjectsWidgetActions,
  getProjectsWidgetState,
] = createModule(ProjectsWidgetSymbol)
  .withActions({
    $mounted: null,
    load: null,
    loaded: (stats: ReportStats[], units: OrganizationUnit[]) => ({
      payload: { stats, units },
    }),
    updated: (stats: ReportStats[]) => ({
      payload: { stats },
    }),
    setLoading: (isLoading: boolean) => ({
      payload: {
        isLoading,
      },
    }),
    changePeriod: (period: FrequencyPeriod) => ({
      payload: { period },
    }),
    changeUnit: (unit: SelectOption<OrganizationUnit>) => ({
      payload: { unit },
    }),
  })
  .withState<ProjectsWidgetState>();

export function ProjectsWidget() {
  handle();
  return <Widget />;
}

function _getStats(
  dashboard: Dashboard,
  period: FrequencyPeriod,
  unit: OrganizationUnit | null | undefined
) {
  const units = dashboard.trackingOrgItems
    .filter(x => x.dashboardItemType === 'Initiative')
    .map(x => x.unitId);
  if (!units.length) {
    return Rx.of([]);
  }
  const criteria: any = {
    organizationId: dashboard.organizationId,
    strategicPlanId: dashboard.strategicPlanId,
    periodNumber: period.periodNumber,
    year: period.year,
    periodFrequency: period.frequency,
    ResponsibleUnits: unit ? [unit.id] : undefined,
    units,
  };
  if (unit) {
    criteria.type = 'Department';
    criteria.aggregate = false;
  }
  if (units.some(x => !x)) {
    delete criteria.units;
  }
  return searchInitiativeStats(criteria);
}

handle
  .epic()
  .on(ProjectsWidgetActions.$mounted, () => ProjectsWidgetActions.load())
  .on(ProjectsWidgetActions.load, () => {
    const { dashboard } = getDashboardState();
    const { user } = getGlobalState();
    return Rx.forkJoin([
      _getStats(dashboard, defaultPeriod, null),
      searchOrganizationUnit({
        type: 'Division',
        organizationId: user?.orgUsers[0].orgId,
        pageSize: 1e6,
      }),
    ]).pipe(
      Rx.map(([stats, units]) =>
        ProjectsWidgetActions.loaded(stats, units.items)
      ),
      catchErrorAndShowModal()
    );
  })
  .onMany(
    [ProjectsWidgetActions.changePeriod, ProjectsWidgetActions.changeUnit],
    () => {
      const { dashboard } = getDashboardState();
      const { period, unit } = getProjectsWidgetState();
      return Rx.concatObs(
        Rx.of(ProjectsWidgetActions.setLoading(true)),
        _getStats(dashboard!, period, unit?.value).pipe(
          Rx.map(stats => ProjectsWidgetActions.updated(stats)),
          catchErrorAndShowModal()
        ),
        Rx.of(ProjectsWidgetActions.setLoading(false))
      );
    }
  );

const initialState: ProjectsWidgetState = {
  isLoading: true,
  period: defaultPeriod,
  stats: [],
  units: [],
  unit: null,
};

handle
  .reducer(initialState)
  .on(ProjectsWidgetActions.load, state => {
    Object.assign(state, initialState);
  })
  .on(ProjectsWidgetActions.loaded, (state, { stats, units }) => {
    state.stats = stats;
    state.units = units;
    state.isLoading = false;
  })
  .on(ProjectsWidgetActions.updated, (state, { stats }) => {
    state.stats = stats;
  })
  .on(ProjectsWidgetActions.changePeriod, (state, { period }) => {
    state.period = period;
  })
  .on(ProjectsWidgetActions.changeUnit, (state, { unit }) => {
    state.unit = unit;
  })
  .on(ProjectsWidgetActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  });
