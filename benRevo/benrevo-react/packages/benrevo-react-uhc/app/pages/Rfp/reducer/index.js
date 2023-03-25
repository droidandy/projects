import {
  RfpReducerState,
  LifeStdLtdReducer,
  CommonReducer,
} from '@benrevo/benrevo-react-rfp';

function quoteReducer(state = RfpReducerState, action) {
  let finalState = state;

  finalState = LifeStdLtdReducer(finalState, action);
  finalState = CommonReducer(finalState, action);

  return finalState;
}

export default quoteReducer;
