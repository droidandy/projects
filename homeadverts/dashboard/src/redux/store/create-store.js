import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { enableBatching } from 'redux-batched-actions';
import persistStore from './persist-store';
import persistReducer from './persist-reducers';

function devTools() {
  /* eslint no-underscore-dangle: 0 */
  return typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
}

export default function initStore(initialState = {}) {
  const middleware = [thunk];
  const enhancers = [devTools()];
  const rootReducer = enableBatching(persistReducer({}));

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers,
    ),
  );
  const persistor = persistStore(store);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return { store, persistor };
}
