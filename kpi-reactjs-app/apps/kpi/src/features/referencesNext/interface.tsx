import { createModule } from 'typeless';
import { ReferencesNextSymbol } from './symbol';
import { User, BalancedScorecard } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  ReferencesNextActions,
  getReferencesNextState,
] = createModule(ReferencesNextSymbol)
  .withActions({
    reset: null,
    loadUsers: null,
    usersLoaded: (users: User[]) => ({ payload: { users } }),
    loadScorecards: null,
    scorecardsLoaded: (scorecards: BalancedScorecard[]) => ({
      payload: { scorecards },
    }),
  })
  .withState<ReferencesNextState>();

// --- Types ---
export interface ReferencesNextState {
  users: {
    isLoaded: boolean;
    isLoading: boolean;
    users: User[];
  };
  scorecards: {
    isLoaded: boolean;
    isLoading: boolean;
    scorecards: BalancedScorecard[];
  };
}
