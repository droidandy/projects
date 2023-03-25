import React from 'react';
import * as Rx from 'src/rx';
import { BalancedScorecardView } from './components/BalancedScorecardView';
import {
  BalancedScorecardActions,
  BalancedScorecardState,
  handle,
  getBalancedScorecardState,
  ScorecardQueryFilter,
} from './interface';
import {
  getMyBscList,
  getScorecardById,
  searchScorecardAllowedParent,
  createResource,
  searchKpiPerformanceStats,
} from 'shared/API';
import { getGlobalState } from '../global/interface';
import { catchErrorAndShowModal, parseQueryString } from 'src/common/utils';
import { BalancedScorecardItem, BalancedScorecard } from 'src/types';
import { RouterLocation, getRouterState, RouterActions } from 'typeless-router';
import { stringifyQueryString } from 'shared/helper';

// --- Epic ---

function _getCriteria(useFrequency = false) {
  const period = getQueryFilter(getRouterState().location!, 0);
  const { currentPlanId } = getGlobalState();
  const criteria: any = {
    periodNumber: period.periodNumber,
    year: period.year,
    [useFrequency ? 'periodFrequency' : 'periodAggregation']: period.frequency,
    strategicPlanId: currentPlanId,
  };

  return criteria;
}

function _getStatsCriteria(scorecard: BalancedScorecard) {
  const criteria = {
    ..._getCriteria(true),
    organizationUnitType: 'Division',
    aggregate: true,
  };
  if (scorecard.unitId) {
    criteria.responsibleUnits = [scorecard.unitId];
  } else {
    criteria.organizationId = scorecard.organizationId;
  }

  return criteria;
}

function _getScorecardId() {
  const location = getRouterState().location!;
  const params = parseQueryString(location.search);
  return params.scorecardId ? Number(params.scorecardId) : null;
}

export function getQueryFilter(
  location: RouterLocation,
  defaultScorecardId: number
): ScorecardQueryFilter {
  const params = parseQueryString(location.search);

  return {
    frequency: params.frequency || 'Annually',
    periodNumber: params.periodNumber ? Number(params.periodNumber) : 1,
    year: params.year ? Number(params.year) : new Date().getFullYear(),
    scorecardId: params.scorecardId
      ? Number(params.scorecardId)
      : defaultScorecardId,
  } as ScorecardQueryFilter;
}

function getCurrentQueryFilter() {
  return getQueryFilter(
    getRouterState().location!,
    getBalancedScorecardState().scorecards[0].id
  );
}

function getRedirect(filter: ScorecardQueryFilter) {
  return RouterActions.push({
    pathname: '/bsc',
    search: stringifyQueryString(filter as any),
  });
}

handle
  .epic()
  .on(BalancedScorecardActions.$mounted, () => BalancedScorecardActions.load())
  .on(RouterActions.locationChange, () => {
    const defaultId = getBalancedScorecardState().scorecards[0]?.id;

    const { location, prevLocation } = getRouterState();
    const filter = getQueryFilter(location!, defaultId);
    const prevFilter = getQueryFilter(prevLocation!, defaultId);
    if (
      filter.frequency !== prevFilter.frequency ||
      filter.periodNumber !== prevFilter.periodNumber ||
      filter.year !== prevFilter.year
    ) {
      return BalancedScorecardActions.load();
    }
    return BalancedScorecardActions.loadScorecard(filter.scorecardId);
  })
  .on(BalancedScorecardActions.changeViewMode, () =>
    BalancedScorecardActions.loadScorecard(getCurrentQueryFilter().scorecardId)
  )
  .on(BalancedScorecardActions.changePeriod, ({ period }) => {
    const filter = getCurrentQueryFilter();
    filter.frequency = period.frequency;
    filter.periodNumber = period.periodNumber;
    filter.year = period.year;
    return getRedirect(filter);
  })
  .on(BalancedScorecardActions.changeScorecard, ({ id }) => {
    const filter = getCurrentQueryFilter();
    filter.scorecardId = id;
    return getRedirect(filter);
  })
  .on(BalancedScorecardActions.load, (_, { action$ }) => {
    return Rx.forkJoin([
      getMyBscList({
        ..._getCriteria(),
        pageSize: 1e4,
      }),
      searchScorecardAllowedParent({}),
    ]).pipe(
      Rx.mergeMap(([scorecards, allowedParentTypes]) => [
        BalancedScorecardActions.loaded(
          scorecards.items,
          allowedParentTypes.items
        ),
        BalancedScorecardActions.changeScorecard(
          _getScorecardId() || scorecards.items[0].id
        ),
      ]),
      catchErrorAndShowModal(),
      Rx.takeUntil(action$.pipe(Rx.waitForType(BalancedScorecardActions.load)))
    );
  })
  .on(BalancedScorecardActions.loadScorecard, ({ id }, { action$ }) => {
    const { viewMode, scorecards } = getBalancedScorecardState();
    return Rx.forkJoin([
      getScorecardById(id, {
        ..._getCriteria(),
        isAggregated: viewMode === 'table',
      }),
      searchKpiPerformanceStats(
        _getStatsCriteria(scorecards.find(x => x.id === id)!)
      ),
    ]).pipe(
      Rx.map(([scorecard, stats]) =>
        BalancedScorecardActions.scorecardLoaded(scorecard, stats[0])
      ),
      catchErrorAndShowModal(),
      Rx.takeUntil(
        action$.pipe(Rx.waitForType(BalancedScorecardActions.loadScorecard))
      )
    );
  })
  .on(BalancedScorecardActions.addItem, ({ type, parent, name, callback }) => {
    const { scorecard } = getBalancedScorecardState();
    return createResource(type, {
      name: {
        ar: name,
        en: name,
      },
      description: {
        en: '',
        ar: '',
      },
      typeId: type,
      status: 'Active',
      parentId: parent ? parent.id : null,
      responsibleUnitId: parent ? parent.responsibleUnitId : scorecard.unitId,
      balancedScorecardId: scorecard.id,
    }).pipe(
      Rx.map((item: BalancedScorecardItem) => {
        callback('clear');
        return BalancedScorecardActions.itemCreated(item);
      }),
      Rx.catchError(e => {
        callback('error');
        throw e;
      }),
      catchErrorAndShowModal()
    );
  });

// --- Reducer ---
const initialState: BalancedScorecardState = {
  isLoaded: false,
  isStatsLoading: true,
  isScorecardLoading: true,
  scorecard: null!,
  scorecards: [],
  parentTypes: [],
  stats: null!,
  viewMode: 'tree',
};

handle
  .reducer(initialState)
  .on(BalancedScorecardActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(BalancedScorecardActions.load, state => {
    state.isStatsLoading = true;
  })
  .on(BalancedScorecardActions.loaded, (state, { scorecards, parentTypes }) => {
    state.isLoaded = true;
    state.isStatsLoading = false;
    state.scorecards = scorecards;
    state.parentTypes = parentTypes;
  })
  .on(
    BalancedScorecardActions.scorecardLoaded,
    (state, { scorecard, stats }) => {
      state.isScorecardLoading = false;
      state.scorecard = scorecard;
      state.stats = stats;
    }
  )
  .on(BalancedScorecardActions.loadScorecard, (state, { id }) => {
    state.isScorecardLoading = true;
  })
  .on(BalancedScorecardActions.itemCreated, (state, { item }) => {
    state.scorecard.scorecardItems.push(item);
  })
  .on(BalancedScorecardActions.changeViewMode, (state, { viewMode }) => {
    state.viewMode = viewMode;
  });

// --- Module ---
export default () => {
  handle();
  return <BalancedScorecardView />;
};
