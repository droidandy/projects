/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, autoRehydrate } from 'redux-persist-immutable';
import createEncryptor from 'redux-persist-transform-encrypt';
import { watchAuth, watchUserGA, keepPersist, keepStore } from '@benrevo/benrevo-react-core';
import { watchFetchData, watchSaveClient } from '@benrevo/benrevo-react-clients';
import createReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();
const encryptor = createEncryptor({
  secretKey: process.env.ENCRYPT_KEY,
});

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
      blacklist: ['route', 'rfpFiles', 'carrier', 'notifications', 'global'], // Rehydrating route causes issues when the login callback redirects.
      transforms: [
        encryptor,
      ],
    }, () => {
      if (callback && typeof callback === 'function') callback(store);
    }));
  }

  // Extensions
  store.runSaga = sagaMiddleware.run;
  sagaMiddleware.run(watchSaveClient);
  sagaMiddleware.run(watchFetchData);
  sagaMiddleware.run(watchAuth);
  sagaMiddleware.run(watchUserGA);

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
