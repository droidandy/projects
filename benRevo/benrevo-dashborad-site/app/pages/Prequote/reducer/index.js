import {
  LifeStdLtdReducer,
  CommonReducer,
} from '@benrevo/benrevo-react-rfp';
import { reducer as ModifiedCommonReducer } from './common';
import { reducer as clientReducer } from './client';
import { reducer as raterReducer } from './rater';
import { reducer as uploadQuoteReducer } from './uploadQuote';
import { reducer as sendReducer } from './send';
import { reducer as bankReducer } from './bank';
import { reducer as matchReducer } from './match';
import RfpReducerState from './state';

function quoteReducer(state = RfpReducerState, action) {
  let finalState = state;
  finalState = LifeStdLtdReducer(finalState, action);
  finalState = CommonReducer(finalState, action);
  finalState = ModifiedCommonReducer(finalState, action);
  finalState = clientReducer(finalState, action);
  finalState = matchReducer(finalState, action);
  finalState = raterReducer(finalState, action);
  finalState = uploadQuoteReducer(finalState, action);
  finalState = bankReducer(finalState, action);
  finalState = sendReducer(finalState, action);

  return finalState;
}

export default quoteReducer;
