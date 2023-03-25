import { fromJS, Map } from 'immutable';
import validator from 'validator';
import * as medicalGroups from '../Comparison/constants';
import * as types from '../constants';

export function openedOptionClear(state, action) {
  const data = fromJS({
    totalAnnualPremium: 0,
    percentDifference: 0,
    dollarDifference: 0,
    overviewPlans: [],
    detailedPlans: [],
  });
  return state
    .setIn([action.meta.section, 'openedOption'], data)
    .setIn([action.meta.section, 'plansGetSuccess'], false)
    .setIn([action.meta.section, 'addingNetworks'], false)
    .setIn([action.meta.section, 'loading'], false);
}

export function carrierNetworksGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'openedOption', 'detailedPlans', action.payload.index, 'networks'], action.payload.data);
}

export function carrierRxNetworksGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'openedOption', 'detailedPlans', action.payload.index, 'rxNetworks'], action.payload.data);
}

export function optionNetworkGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'networks'], fromJS(action.payload));
}

export function optionNetworkAdd(state, action) {
  return state
    .setIn([action.meta.section, 'addingNetworks'], true);
}

export function optionContributionGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'openedOptionContributions'], fromJS(action.payload))
    .setIn([action.meta.section, 'contributionsBase'], fromJS(action.payload));
}

export function optionRiderGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'openedOptionRider'], fromJS(action.payload));
}

export function optionRiderFeeGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'riderFees'], fromJS(action.payload));
}

export function optionRiderFeeSave(state, action) {
  let riders = state.get(action.meta.section).get('openedOptionRider').get('networkRidersDtos');

  riders.map((item, i) => {
    if (item.get('rfpQuoteOptionNetworkId') === action.payload.rfpQuoteOptionNetworkId) {
      riders = riders.setIn([i, 'administrativeFeeId'], action.payload.administrativeFeeId);
      return true;
    }
    return true;
  });

  return state
    .setIn([action.meta.section, 'openedOptionRider', 'networkRidersDtos'], riders);
}

export function optionRiderSelect(state, action) {
  let riders = state.get(action.meta.section).get('openedOptionRider').get('networkRidersDtos');

  riders.map((item, i) => {
    if (item.get('rfpQuoteOptionNetworkId') === action.payload.rfpQuoteOptionNetworkId) {
      riders.get(i).get('riders').map((rider, j) => {
        if (rider.get('riderId') === action.payload.riderId) {
          riders = riders.setIn([i, 'riders', j, 'selected'], true);
          return true;
        }
        return true;
      });
      return true;
    }
    return true;
  });
  return state
    .setIn([action.meta.section, 'openedOptionRider', 'networkRidersDtos'], riders);
}

export function optionRiderUnselect(state, action) {
  let riders = state.get(action.meta.section).get('openedOptionRider').get('networkRidersDtos');

  riders.map((item, i) => {
    if (item.get('rfpQuoteOptionNetworkId') === action.payload.rfpQuoteOptionNetworkId) {
      riders.get(i).get('riders').map((rider, j) => {
        if (rider.get('riderId') === action.payload.riderId) {
          riders = riders.setIn([i, 'riders', j, 'selected'], false);
          return true;
        }
        return true;
      });
      return true;
    }
    return true;
  });
  return state
    .setIn([action.meta.section, 'openedOptionRider', 'networkRidersDtos'], riders);
}

export function comparisonGet(state) {
  return state
    .setIn(['medical', 'loading'], true)
    .setIn(['medical', 'medicalGroupsColumns'], fromJS({}));
}

export function comparisonGetSuccess(state, action) {
  const comp = action.payload;
  const medicalGroupsColumns = {};
  for (let i = 0; i < comp.length; i += 1) {
    const item = comp[i];

    if (item.networks) {
      for (let j = 0; j < item.networks.length; j += 1) {
        const network = item.networks[j];
        item[network.name] = 1;
        if (medicalGroups.columns[network.name]) medicalGroupsColumns[network.name] = true;
      }

      delete item.networks;
    }
  }

  return state
    .setIn(['medical', 'medicalGroups'], fromJS(comp))
    .setIn(['medical', 'medicalGroupsColumns'], fromJS(medicalGroupsColumns))
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

export function disclaimerGet(state, action) {
  return state
    .setIn([action.meta.section, 'disclaimer'], {})
    .setIn(['quote', 'loading'], true)
    .setIn(['quote', 'err'], false);
}

export function disclaimerGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'disclaimer'], action.payload)
    .setIn(['quote', 'loading'], false)
    .setIn(['quote', 'err'], false);
}

export function disclaimerGetError(state) {
  return state
    .setIn(['quote', 'loading'], false)
    .setIn(['quote', 'err'], true);
}

export function refreshPresentationData(state, action) {
  return state
    .setIn([action.meta.section, 'alternativesLoading'], false)
    .setIn([action.meta.section, 'loading'], action.payload.loading);
}

export function dataRefreshed(state, action) {
  const plans = state.getIn([action.meta.section, 'openedOption', 'detailedPlans']).toJS();
  const data = action.payload.data;
  const excludes = action.payload.excludes;

  if (excludes.carrierNetwors && data.id === state.getIn([action.meta.section, 'openedOption', 'id'])) {
    for (let i = 0; i < plans.length; i += 1) {
      if (data.detailedPlans[i]) data.detailedPlans[i].networks = plans[i].networks;
    }
  }


  return state
    .setIn([action.meta.section, 'page', 'id'], data.id)
    .setIn([action.meta.section, 'openedOption'], fromJS(data))
    .setIn([action.meta.section, 'addingNetworks'], false)
    .setIn([action.meta.section, 'loading'], false);
}

export function dataRefreshError(state, action) {
  return state
    .setIn([action.meta.section, 'error'], action.error.message)
    .setIn([action.meta.section, 'loading'], false);
}

export function optionCompareNetworksGet(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], true)
    .setIn([action.meta.section, 'compareNetworks'], Map({}));
}

export function optionCompareNetworksGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], false)
    .setIn([action.meta.section, 'compareNetworks'], fromJS(action.payload));
}

export function optionCompareNetworksGetError(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], false)
    .setIn([action.meta.section, 'compareNetworks'], fromJS(action.payload));
}

export function changeContributionType(state, action) {
  return state
    .setIn([action.meta.section, 'openedOptionContributions', action.payload.index, 'proposedContrFormat'], action.payload.value);
}

export function changeContribution(state, action) {
  const payload = action.payload;

  const contribution = state
    .get(action.meta.section)
    .get('openedOptionContributions')
    .get(payload.index)
    .get('contributions')
    .get(payload.cIndex);
  const currentValue = contribution
    .get(payload.key);
  let value = payload.value;

  if (payload.value !== '' && !validator.isInt(payload.value) && !validator.isFloat(payload.value)) {
    value = currentValue;
  }

  return state
    .setIn([action.meta.section, 'openedOptionContributions', payload.index, 'contributions', payload.cIndex, payload.key], value);
}

export function contributionCancel(state, action) {
  return state
    .setIn([action.meta.section, 'openedOptionContributions'], state.get(action.meta.section).get('contributionsBase'));
}

export function contributionEdit(state, action) {
  return state
    .setIn([action.meta.section, 'contributionsEdit', action.payload.index], action.payload.edit);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.OPENED_OPTION_CLEAR: return openedOptionClear(state, action);
    case types.CARRIER_RX_NETWORKS_GET_SUCCESS: return carrierRxNetworksGetSuccess(state, action);
    case types.CARRIER_NETWORKS_GET_SUCCESS: return carrierNetworksGetSuccess(state, action);
    case types.OPTION_NETWORK_GET_SUCCESS: return optionNetworkGetSuccess(state, action);
    case types.OPTION_NETWORK_ADD: return optionNetworkAdd(state, action);
    case types.OPTION_CONTRIBUTION_GET_SUCCESS: return optionContributionGetSuccess(state, action);
    case types.OPTION_RIDER_GET_SUCCESS: return optionRiderGetSuccess(state, action);
    case types.OPTION_RIDER_FEE_GET_SUCCESS: return optionRiderFeeGetSuccess(state, action);
    case types.OPTION_RIDER_FEE_SAVE: return optionRiderFeeSave(state, action);
    case types.OPTION_RIDER_SELECT: return optionRiderSelect(state, action);
    case types.OPTION_RIDER_UNSELECT: return optionRiderUnselect(state, action);
    case types.COMPARISON_GET: return comparisonGet(state, action);
    case types.COMPARISON_GET_SUCCESS: return comparisonGetSuccess(state, action);
    case types.COMPARISON_GET_ERROR: return comparisonGetError(state, action);
    case types.DISCLAIMER_GET: return disclaimerGet(state, action);
    case types.DISCLAIMER_GET_SUCCESS: return disclaimerGetSuccess(state, action);
    case types.DISCLAIMER_GET_ERROR: return disclaimerGetError(state, action);
    case types.REFRESH_PRESENTATION_DATA: return refreshPresentationData(state, action);
    case types.DATA_REFRESHED: return dataRefreshed(state, action);
    case types.DATA_REFRESH_ERROR: return dataRefreshError(state, action);
    case types.OPTION_COMPARE_NETWORKS_GET: return optionCompareNetworksGet(state, action);
    case types.OPTION_COMPARE_NETWORKS_GET_SUCCESS: return optionCompareNetworksGetSuccess(state, action);
    case types.OPTION_COMPARE_NETWORKS_GET_ERROR: return optionCompareNetworksGetError(state, action);
    case types.CHANGE_CONTRIBUTION_TYPE: return changeContributionType(state, action);
    case types.CHANGE_CONTRIBUTION: return changeContribution(state, action);
    case types.CANCEL_CONTRIBUTION: return contributionCancel(state, action);
    case types.EDIT_CONTRIBUTION: return contributionEdit(state, action);
    default: return state;
  }
}
