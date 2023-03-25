import { createModule } from 'typeless';
import * as Rx from 'src/rx';
import { ChallengesWidgetSymbol } from '../../symbol';
import { FrequencyPeriod } from 'src/types';
import { Challenge, SearchResult } from 'shared/types';
import React from 'react';
import { Widget } from './Widget';
import { defaultPeriod } from '../../utils';
import { searchChallenge } from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';

export interface ChallengesWidgetState {
  period: FrequencyPeriod;
  isLoading: boolean;
  isPageLoading: boolean;
  challenges: Challenge[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export const [
  handle,
  ChallengesWidgetActions,
  getChallengesWidgetState,
] = createModule(ChallengesWidgetSymbol)
  .withActions({
    $mounted: null,
    load: (reset: boolean) => ({ payload: { reset } }),
    loaded: (result: SearchResult<Challenge>) => ({ payload: { result } }),
    changePeriod: (period: FrequencyPeriod) => ({
      payload: { period },
    }),
    setLoading: (isLoading: boolean) => ({
      payload: {
        isLoading,
      },
    }),
    setPageLoading: (isPageLoading: boolean) => ({
      payload: {
        isPageLoading,
      },
    }),
    changePage: (pageIndex: number) => ({
      payload: { pageIndex },
    }),
  })
  .withState<ChallengesWidgetState>();

export function ChallengesWidget() {
  handle();
  return <Widget />;
}

handle
  .epic()
  .on(ChallengesWidgetActions.$mounted, () =>
    ChallengesWidgetActions.load(true)
  )
  .on(ChallengesWidgetActions.load, ({ reset }) => {
    const { period } = getChallengesWidgetState();
    const { pageIndex } = getChallengesWidgetState();
    return searchChallenge({
      year: period.year,
      periodFrequency: period.frequency,
      periodNumber: reset ? 1 : period.periodNumber,
      pageSize: 5,
      pageIndex,
    }).pipe(
      Rx.map(ret => ChallengesWidgetActions.loaded(ret)),
      catchErrorAndShowModal()
    );
  })
  .on(ChallengesWidgetActions.changePeriod, () => {
    return [
      ChallengesWidgetActions.setLoading(true),
      ChallengesWidgetActions.load(true),
    ];
  })
  .on(ChallengesWidgetActions.changePage, () => {
    return [
      ChallengesWidgetActions.setPageLoading(true),
      ChallengesWidgetActions.load(true),
    ];
  });

const initialState: ChallengesWidgetState = {
  period: defaultPeriod,
  isLoading: true,
  isPageLoading: true,
  challenges: [],
  pageIndex: 1,
  pageSize: 5,
  totalCount: 0,
};

handle
  .reducer(initialState)
  .on(ChallengesWidgetActions.$mounted, state => {
    Object.assign(state, initialState);
  })
  .on(ChallengesWidgetActions.loaded, (state, { result }) => {
    state.isLoading = false;
    state.isPageLoading = false;
    state.challenges = result.items;
    state.pageIndex = result.metadata.pageIndex;
    state.totalCount = result.metadata.totalCount;
  })
  .on(ChallengesWidgetActions.changePeriod, (state, { period }) => {
    state.period = period;
  })
  .on(ChallengesWidgetActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(ChallengesWidgetActions.setPageLoading, (state, { isPageLoading }) => {
    state.isPageLoading = isPageLoading;
  })
  .on(ChallengesWidgetActions.changePage, (state, { pageIndex }) => {
    state.pageIndex = pageIndex;
  });
