import * as React from 'react';
import * as R from 'remeda';
import { BalancedScorecard, Lookup } from 'src/types';
import { getBalancedScorecardState } from './interface';
import { getRouterState } from 'typeless-router';
import { getQueryFilter } from './module';

export function usePerformanceMap(
  lookups: Lookup[],
  scorecard: BalancedScorecard
) {
  return React.useMemo(() => {
    const lookupMap = R.indexBy(lookups, x => x.id);
    return R.pipe(
      scorecard.objectPerformances,
      R.map(item => {
        return {
          ...item,
          performanceColor: lookupMap[item.performanceColorId],
        };
      }),
      R.indexBy(x => x.linkedObjectId)
    );
  }, [scorecard]);
}

export function useQueryFilter() {
  const { scorecards } = getBalancedScorecardState.useState();
  const { location } = getRouterState.useState();

  return React.useMemo(() => {
    return getQueryFilter(location!, scorecards[0].id);
  }, [location, scorecards]);
}
