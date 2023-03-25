import React from 'react';
import * as Rx from 'src/rx';
import { ScorecardsListView } from './components/ScorecardsListView';
import {
  ScorecardsListActions,
  ScorecardsListState,
  handle,
  getScorecardsListState,
} from './interface';
import {
  searchScorecardsList,
  deleteScorecardsList,
} from 'src/services/API-next';
import {
  mixinList,
  defaultListInitialState,
} from '../../mixins/listMixin-next';
import { getGlobalState } from '../global/interface';
import { catchErrorAndShowModal } from 'src/common/utils';

const initialState: ScorecardsListState = {
  ...defaultListInitialState,
  sortBy: 'strategicPlanId',
  filter: {
    strategicPlanId: 1,
    enabled: true,
  },
  appliedFilter: {
    strategicPlanId: 1,
    enabled: true,
  },
};

const { epic } = mixinList({
  handle,
  initialState,
  Actions: ScorecardsListActions,
  searchCriteria: {
    strategicPlanId: 'number',
    enabled: 'bool',
  },
  getState: getScorecardsListState,
  search: criteria =>
    searchScorecardsList({
      ...criteria,
      strategicPlanId: getGlobalState().currentPlanId,
    }),
  exportItems: () => {
    //
  },
});

epic.on(ScorecardsListActions.onDelete, ({ scorecard }) => {
  return Rx.concatObs(
    deleteScorecardsList(scorecard.id).pipe(
      Rx.ignoreElements(),
      catchErrorAndShowModal()
    ),
    Rx.of(ScorecardsListActions.applyFilter())
  );
});

export default () => {
  handle();
  return <ScorecardsListView />;
};
