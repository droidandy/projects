import {
  LifeStdLtdReducer,
  CommonReducer,
} from '@benrevo/benrevo-react-rfp';
import { reducer as ModifiedCommonReducer } from './common';
import RfpReducerState from './state';

function quoteReducer(state = RfpReducerState, action) {
  let finalState = state;

  finalState = LifeStdLtdReducer(finalState, action);
  finalState = CommonReducer(finalState, action);
  finalState = ModifiedCommonReducer(finalState, action);

  return finalState;
}

export default quoteReducer;
