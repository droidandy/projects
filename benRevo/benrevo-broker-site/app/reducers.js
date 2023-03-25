/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { reducer as notifications } from 'react-notification-system-redux';
import { persist, CHECK_VERSION, LOGOUT, version, authReducer, languageProviderReducer, AdminReducer } from '@benrevo/benrevo-react-core';
import { clientsReducer } from '@benrevo/benrevo-react-clients';
import { RFPReducerFiles, CarrierReducer } from '@benrevo/benrevo-react-rfp';
import globalReducer from './pages/App/reducer';
import RFPBrokerReducer from './pages/Rfp/reducerBroker';
import RFPReducer from './pages/Rfp/reducer';
import AdminBrokerReducer from './pages/Admin/reducer';
import clientPageReducer from './pages/Clients/Client/reducer';
import quoteReducer from './pages/Quote/reducer';
import setupPresentationReducer from './pages/SetupPresentation/reducer';

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
    adminBroker: AdminBrokerReducer,
    language: languageProviderReducer,
    profile: authReducer,
    adminPage: AdminReducer,
    clients: clientsReducer,
    client: clientPageReducer,
    rfp: RFPReducer,
    rfpBroker: RFPBrokerReducer,
    rfpFiles: RFPReducerFiles,
    carrier: CarrierReducer,
    presentation: quoteReducer,
    setupPresentation: setupPresentationReducer,
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
