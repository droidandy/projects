import React from 'react';
import * as Rx from 'src/rx';
import { ChallengesView } from './components/ChallengesView';
import {
  ChallengesActions,
  ChallengesState,
  handle,
  getChallengesState,
} from './interface';
import { mixinList, defaultListInitialState } from 'src/mixins/listMixin-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getGlobalState } from '../global/interface';
import { searchChallenge, deleteChallenge } from 'src/services/API-next';

const initialState: ChallengesState = {
  ...defaultListInitialState,
  sortBy: 'name',
  filter: {},
  appliedFilter: {},
};

const { epic } = mixinList({
  handle,
  initialState,
  Actions: ChallengesActions,
  searchCriteria: {},
  getState: getChallengesState,
  search: criteria =>
    searchChallenge({
      ...criteria,
      strategicPlanId: getGlobalState().currentPlanId,
    }),
  exportItems: () => {
    //
  },
});

epic.on(ChallengesActions.onDelete, ({ challenge }) => {
  return Rx.concatObs(
    deleteChallenge(challenge.id).pipe(
      Rx.ignoreElements(),
      catchErrorAndShowModal()
    ),
    Rx.of(ChallengesActions.applyFilter())
  );
});

// --- Module ---
export default () => {
  handle();
  return <ChallengesView />;
};
