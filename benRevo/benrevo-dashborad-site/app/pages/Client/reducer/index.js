import {
  QuoteState,
  AlternativesReducer,
  CommonReducer,
  DocumentsReducer,
  EnrollmentRedcuer,
  OptionsReducer,
  OverviewReducer,
} from '@benrevo/benrevo-react-quote';
import { MatchReducer, MatchState } from '@benrevo/benrevo-react-match';
import { reducer as ModifiedCommonReducer } from './common';
const finalQuoteState = QuoteState.mergeDeep(MatchState);

function quoteReducer(state = finalQuoteState, action) {
  let finalState = state;

  finalState = AlternativesReducer(finalState, action);
  finalState = CommonReducer(finalState, action);
  finalState = DocumentsReducer(finalState, action);
  finalState = EnrollmentRedcuer(finalState, action);
  finalState = OptionsReducer(finalState, action);
  finalState = OverviewReducer(finalState, action);
  finalState = ModifiedCommonReducer(finalState, action);
  finalState = MatchReducer(finalState, action);

  return finalState;
}

export default quoteReducer;
