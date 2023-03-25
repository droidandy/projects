import { AnyAction, applyMiddleware, Reducer } from 'redux';
import { isSsr } from 'helpers/isSsr';
import { StoreType, StateModel } from './types';
import { initialState } from './initial-state';
import { rootReducer } from './root-reducer';
// import { impersonalisationSkipAuthRefresh } from './user/middlewares';
import { initStore } from './store';

let store: StoreType | undefined;

export const SET_APP_STATE_ACTION = 'SET_APP';

const extendedReducer: Reducer<StateModel, AnyAction> = (state: StateModel | undefined, action: AnyAction) => {
  if (action.type === SET_APP_STATE_ACTION) {
    return { ...state, ...action.payload } as StateModel;
  }
  return rootReducer(state, action);
};

export const getSsrStore = <S extends StateModel>(preloadedState?: Partial<S>): StoreType => {
  if (typeof window === 'object' && store) {
    if (preloadedState) {
      store.dispatch({
        type: SET_APP_STATE_ACTION,
        payload: {
          ...preloadedState,
        },
      });
    }
  } else {
    store = initStore(extendedReducer, { ...initialState, ...preloadedState }, applyMiddleware(), {
      initial: isSsr,
    });
  }

  return store;
};

export const getStore = (): StoreType => getSsrStore();
