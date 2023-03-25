/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { reducer as notifications } from 'react-notification-system-redux';

import languageProviderReducer from 'containers/LanguageProvider/reducer';
import globalReducer from 'pages/App/reducer';
import baseReducer from 'pages/Client/reducer';
import DataAccessReducer from 'pages/DataAccess/reducer';
import SalesReducer from 'pages/Sales/reducer';
import BrokerageReducer from 'pages/Brokerage/reducer';
import plansReducer from 'pages/Plans/reducer';
import plansFilesReducer from 'pages/Plans/reducerFiles';
import clearValuePage from 'pages/Anthem/ClearValue/reducer';
import CarrierFilesReducer from 'pages/CarrierFiles/reducer';
import optimizerPage from 'pages/Optimizer/reducer';
import accountsPage from 'pages/Accounts/reducer';
import PlanDesignReducer from 'pages/PlanDesign/reducer';
import authReducer from 'utils/authService/reducer';

import { persist } from './utils/persistStore';
import version, { CHECK_VERSION } from './utils/version';
import {
  LOGOUT,
} from './utils/authService/constants';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  locationBeforeTransitions: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the asynchronously loaded ones
 */

export default function createReducer(asyncReducers) {
  const appReducer = combineReducers({
    notifications,
    route: routeReducer,
    app: globalReducer,
    language: languageProviderReducer,
    profile: authReducer,
    plans: plansReducer,
    dataAccess: DataAccessReducer,
    plansFiles: plansFilesReducer,
    carrierFiles: CarrierFilesReducer,
    sales: SalesReducer,
    base: baseReducer,
    brokerage: BrokerageReducer,
    planDesign: PlanDesignReducer,
    clearValuePage,
    optimizerPage,
    accountsPage,
    ...asyncReducers,
  });

  return (state, action) => {
    if (action.type === LOGOUT) {
      if (persist.instance) persist.instance.purge();

      return appReducer(undefined, action);
    }
    if (action.type === CHECK_VERSION) {
      if (!version.checkVersion() && persist.instance) {
        persist.instance.purge();
        return appReducer(undefined, action);
      }
    }

    return appReducer(state, action);
  };
}
