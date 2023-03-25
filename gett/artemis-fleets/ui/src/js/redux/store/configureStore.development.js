import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import immutableState from 'redux-immutable-state-invariant';

const enhancer = compose(
  applyMiddleware(createLogger({ collapsed: true }), immutableState())
);

export default function configureStore(reducer, initialState) {
  return createStore(reducer, initialState, enhancer);
}
