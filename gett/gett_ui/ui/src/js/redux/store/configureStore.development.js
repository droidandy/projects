import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import immutableState from 'redux-immutable-state-invariant';

import DevTools from 'utils/dev-tools';

const enhancer = compose(
  applyMiddleware(createLogger({ collapsed: true }), immutableState()),
  DevTools.instrument()
);

export default function configureStore(reducer, initialState) {
  return createStore(reducer, initialState, enhancer);
}
