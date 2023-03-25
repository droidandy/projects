/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, autoRehydrate } from 'redux-persist-immutable';
import { keepPersist, keepStore } from '@benrevo/benrevo-react-core';
import { ClientSagas } from '@benrevo/benrevo-react-clients';
import AppSagas from './pages/App/sagas';
import createReducer from './reducers';
import { watchAuth } from './utils/authService/sagas';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}, history, callback, persist) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
  /* eslint-enable */

  const store = autoRehydrate()(createStore)(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

  if (persist) {
    keepPersist(persistStore(store, {
      blacklist: ['route', 'app', 'rfpFiles', 'notifications'], // Rehydrating route causes issues when the login callback redirects.
    }, () => {
      if (callback) callback(store);
    }));
  }

  // Extensions
  store.runSaga = sagaMiddleware.run;
  sagaMiddleware.run(ClientSagas[0]);
  sagaMiddleware.run(ClientSagas[1]);
  sagaMiddleware.run(AppSagas[0]);
  sagaMiddleware.run(watchAuth);

  store.asyncReducers = {}; // Async reducer registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then((reducerModule) => {
        const createReducers = reducerModule.default;
        const nextReducers = createReducers(store.asyncReducers);

        store.replaceReducer(nextReducers);
      });
    });
  }

  if (!persist && callback) callback(store);

  keepStore(store);

  return store;
}
