import React from 'react';
import { useActions } from 'typeless';
import { getReferencesNextState, ReferencesNextActions } from './interface';

export function useLoadUsers() {
  const { users } = getReferencesNextState.useState();
  const { loadUsers } = useActions(ReferencesNextActions);
  React.useEffect(() => {
    if (!users.isLoaded && !users.isLoading) {
      loadUsers();
    }
  }, []);
}

export function useLoadScorecards() {
  const { scorecards } = getReferencesNextState.useState();
  const { loadScorecards } = useActions(ReferencesNextActions);
  React.useEffect(() => {
    if (!scorecards.isLoaded && !scorecards.isLoading) {
      loadScorecards();
    }
  }, []);
}
