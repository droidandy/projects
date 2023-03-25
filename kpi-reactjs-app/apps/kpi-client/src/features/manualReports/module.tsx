import React from 'react';
import * as Rx from 'src/rx';
import { ManualReportsView } from './components/ManualReportsView';
import { ManualReportsActions, handle, ManualReportsState } from './interface';
import { getManualReports } from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';

// --- Epic ---
handle
  .epic()
  .on(ManualReportsActions.$mounted, () => {
    return Rx.concatObs(Rx.of(ManualReportsActions.get()));
  })
  .on(ManualReportsActions.get, (_, { action$ }) => {
    return Rx.concatObs(
      Rx.of(ManualReportsActions.setIsLoading(true)),
      getManualReports(2).pipe(
        Rx.map(ret => ManualReportsActions.loaded(ret)),
        catchErrorAndShowModal()
      ),
      Rx.of(ManualReportsActions.setIsLoading(false))
    ).pipe(Rx.takeUntil(action$.pipe(Rx.ofType(ManualReportsActions.get))));
  });

// --- Reducer ---
const initialState: ManualReportsState = {
  items: [],
  isLoading: false,
};

handle
  .reducer(initialState)
  .on(ManualReportsActions.$mounted, () => initialState)
  .on(ManualReportsActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(ManualReportsActions.loaded, (state, { items }) => {
    state.items = items;
  });

// --- Module ---
export default () => {
  handle();
  return <ManualReportsView />;
};
