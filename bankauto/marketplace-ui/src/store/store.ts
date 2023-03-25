import { applyMiddleware, createStore, Middleware, PreloadedState, Reducer, StoreEnhancer } from 'redux';
import thunk from 'redux-thunk';
import { createLogger, ReduxLoggerOptions } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { StateModel, ReduxExtraArgument } from './types';

const logger = (active: boolean = false, options?: ReduxLoggerOptions): Middleware => {
  if (active) {
    return createLogger(
      options || {
        collapsed: true,
      },
    );
  }
  return () => (next) => (action) => next(action);
};

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

const initStore = <S extends StateModel, EC extends StoreEnhancer, E extends ReduxExtraArgument = ReduxExtraArgument>(
  reducer: Reducer<S>,
  preloadedState: PreloadedState<S>,
  extendEnchancer?: EC,
  extraArgument?: E,
  options?: {
    debug?: boolean; // isProduction || isSsr
  },
) => {
  const createExtraArgument = extraArgument || ({ initial: false } as ReduxExtraArgument);
  const createEnchancer = applyMiddleware(logger(options?.debug), thunk.withExtraArgument(createExtraArgument));
  const enchancer = extendEnchancer
    ? composeEnhancers(extendEnchancer, createEnchancer)
    : composeEnhancers(createEnchancer);
  return createStore(reducer, preloadedState, enchancer);
};

export { initStore };
