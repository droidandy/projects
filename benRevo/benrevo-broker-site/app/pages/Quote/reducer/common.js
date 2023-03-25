import { fromJS } from 'immutable';
import { comparisonConstants } from '@benrevo/benrevo-react-quote';
import * as types from '../constants';
import initialState from '..';

export function initOptions(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], true);
}

export function initOptionsSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], false);
}

export function initOptionsError(state, action) {
  if (action.meta && action.meta.section) {
    return state
      .setIn([action.meta.section, 'loading'], false);
  }
  return state;
}

export function comparisonGet(state) {
  return state
    .setIn(['medical', 'loading'], true);
}

export function comparisonGetSuccess(state, action) {
  const uhc = action.payload.UHC;
  const anthem = action.payload.ANTHEM_BLUE_CROSS;
  const createColumns = (list) => {
    const medicalGroupsColumns = {};
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];

      if (item.networks) {
        for (let j = 0; j < item.networks.length; j += 1) {
          const network = item.networks[j];
          item[network.name] = 1;
          if (comparisonConstants.columns[network.name]) medicalGroupsColumns[network.name] = true;
        }

        delete item.networks;
      }
    }

    return medicalGroupsColumns;
  };

  return state
    .setIn(['medical', 'providersData', 'uhc'], fromJS(uhc))
    .setIn(['medical', 'providersData', 'anthem'], fromJS(anthem))
    .setIn(['medical', 'providersColumns', 'uhc'], fromJS(createColumns(uhc)))
    .setIn(['medical', 'providersColumns', 'anthem'], fromJS(createColumns(anthem)))
    .setIn(['medical', 'medicalGroupsGetSuccess'], true)
    .setIn(['medical', 'medicalGroupsGetError'], false)
    .setIn(['medical', 'loading'], false);
}

export function comparisonGetError(state) {
  return state
    .setIn(['medical', 'medicalGroupsGetSuccess'], false)
    .setIn(['medical', 'medicalGroupsGetError'], true)
    .setIn(['medical', 'loading'], false);
}

export function changeLoad(state, action) {
  const pages = action.payload;
  let currentState = state.get(action.meta.section);
  Object.keys(pages).map((item) => {
    currentState = currentState.setIn(['load', item], pages[item]);
    return true;
  });

  return state
    .set(action.meta.section, currentState);
}

export function changeLoadReset(state) {
  const final = Map({
    final: true,
  });
  const enrollment = Map({
    enrollment: true,
  });

  return state
    .setIn(['medical', 'load'], initialState.load)
    .setIn(['dental', 'load'], initialState.load)
    .setIn(['vision', 'load'], initialState.load)
    .setIn(['final', 'load'], final)
    .setIn(['enrollment', 'load'], enrollment);
}

export function optionsGet(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], true)
    .setIn([action.meta.section, 'loadingOptions'], true);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.INIT_OPTIONS: return initOptions(state, action);
    case types.INIT_OPTIONS_SUCCESS: return initOptionsSuccess(state, action);
    case types.INIT_OPTIONS_ERROR: return initOptionsError(state, action);
    case types.COMPARISON_GET: return comparisonGet(state, action);
    case types.COMPARISON_GET_SUCCESS: return comparisonGetSuccess(state, action);
    case types.COMPARISON_GET_ERROR: return comparisonGetError(state, action);
    case types.CHANGE_LOAD: return changeLoad(state, action);
    case types.GET_ANOTHER_OPTIONS: return optionsGet(state, action);
    // case types.CHANGE_LOAD_RESET: return changeLoadReset(state, action);
    default: return state;
  }
}
