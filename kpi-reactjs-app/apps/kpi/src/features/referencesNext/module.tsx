import * as Rx from 'src/rx';
import {
  ReferencesNextActions,
  ReferencesNextState,
  handle,
} from './interface';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getAllUsers, getAllScorecards } from 'src/services/API-next';
import { ActionLike } from 'typeless';
import { getGlobalState } from '../global/interface';

export function loadUsersHandler(): Rx.Observable<ActionLike> {
  return getAllUsers().pipe(
    Rx.map(ReferencesNextActions.usersLoaded),
    catchErrorAndShowModal()
  );
}

export function loadScorecardsHandler(): Rx.Observable<ActionLike> {
  const { currentPlanId } = getGlobalState();
  return getAllScorecards(currentPlanId).pipe(
    Rx.map(ReferencesNextActions.scorecardsLoaded),
    catchErrorAndShowModal()
  );
}

// --- Epic ---
handle
  .epic()
  .on(ReferencesNextActions.loadUsers, loadUsersHandler)
  .on(ReferencesNextActions.loadScorecards, loadScorecardsHandler);

// --- Reducer ---
const initialState: ReferencesNextState = {
  users: {
    isLoaded: false,
    isLoading: false,
    users: [],
  },
  scorecards: {
    isLoaded: false,
    isLoading: false,
    scorecards: [],
  },
};

handle
  .reducer(initialState)
  .on(ReferencesNextActions.reset, state => {
    Object.assign(state, initialState);
  })
  .on(ReferencesNextActions.loadUsers, state => {
    state.users.isLoading = true;
  })
  .on(ReferencesNextActions.usersLoaded, (state, { users }) => {
    state.users = {
      isLoaded: true,
      isLoading: false,
      users,
    };
  })
  .on(ReferencesNextActions.loadScorecards, state => {
    state.scorecards.isLoading = true;
  })
  .on(ReferencesNextActions.scorecardsLoaded, (state, { scorecards }) => {
    state.scorecards = {
      isLoaded: true,
      isLoading: false,
      scorecards,
    };
  });

export const useReferencesNextModule = handle;
