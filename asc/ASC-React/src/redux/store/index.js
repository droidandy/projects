import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware, { END } from 'redux-saga';
import createLogger from 'redux-logger';
import rootReducer from './reducers';

const configureStore = (initialState = {}) => {
  const logger = createLogger();
  const sagaMiddleware = createSagaMiddleware();
  const hasWindow = typeof window !== 'undefined';

  const finalCreateStore = compose(
    process.env.NODE_ENV === 'production'
    ? applyMiddleware(thunk, sagaMiddleware)
    : applyMiddleware(thunk, sagaMiddleware, logger),
    hasWindow && window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(rootReducer, initialState);

  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);

  return store;
};

export default configureStore;
