import {
  QuoteState,
  AlternativesReducer,
  CommonReducer,
  DocumentsReducer,
  EnrollmentRedcuer,
  OptionsReducer,
  OverviewReducer,
} from '@benrevo/benrevo-react-quote';
import { reducer as ModifiedCommonReducer } from './common';

function quoteReducer(state = QuoteState, action) {
  let finalState = state;

  finalState = AlternativesReducer(finalState, action);
  finalState = CommonReducer(finalState, action);
  finalState = DocumentsReducer(finalState, action);
  finalState = EnrollmentRedcuer(finalState, action);
  finalState = OptionsReducer(finalState, action);
  finalState = OverviewReducer(finalState, action);
  finalState = ModifiedCommonReducer(finalState, action);

  return finalState;
}

export default quoteReducer;
