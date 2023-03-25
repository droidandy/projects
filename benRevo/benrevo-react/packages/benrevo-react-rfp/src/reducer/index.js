import { reducer as LifeStdLtdReducer } from './lifeStdLtd';
import { reducer as CommonReducer } from './common';
import RfpReducerState from './state';

function quoteReducer(state = RfpReducerState, action) {
  let finalState = state;

  finalState = LifeStdLtdReducer(finalState, action);
  finalState = CommonReducer(finalState, action);

  return finalState;
}

export default quoteReducer;
