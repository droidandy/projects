import {
  PLAN_SECOND_SELECT,
} from '@benrevo/benrevo-react-quote';
import * as types from './constants';

export function getAlternatives(section, rfpQuoteOptionNetworkId, rfpQuoteNetworkId, multiMode) {
  return {
    meta: { section },
    payload: { rfpQuoteOptionNetworkId, rfpQuoteNetworkId, multiMode },
    type: types.GET_ALTERNATIVES,
  };
}

export function addNewPlan(section, rfpQuoteOptionNetworkId, rfpQuoteNetworkId, multiMode) {
  return {
    meta: { section },
    payload: { rfpQuoteOptionNetworkId, rfpQuoteNetworkId, multiMode },
    type: types.GET_ALTERNATIVES,
  };
}

export function getAnotherOptions(section) {
  return {
    meta: {
      section,
    },
    type: types.GET_ANOTHER_OPTIONS,
  };
}

export function getPlansTemplates(section) {
  return {
    meta: { section },
    type: types.PLAN_TEMPLATES_GET,
  };
}

export function clearAlternatives(section) {
  return {
    meta: {
      section,
    },
    type: types.CLEAR_ALTERNATIVES,
  };
}

export function changeFavourite(section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index) {
  return {
    meta: {
      section,
    },
    type: types.PLAN_FAVOIRITE_CHANGE,
    payload: {
      favorite,
      rfpQuoteNetworkId,
      rfpQuoteNetworkPlanId,
      index,
    },
  };
}

export function editPlanField(section, name, value, part, valName, typeOfPlan) {
  return {
    meta: {
      section,
    },
    type: types.ALTERNATIVE_PLAN_VALUE_EDIT,
    payload: {
      name,
      value,
      part,
      valName,
      typeOfPlan,
    },
  };
}

export function editVolPlanField(section, name, value, part, valName, typeOfPlan) {
  return {
    meta: {
      section,
    },
    type: types.VOL_PLAN_VALUE_EDIT,
    payload: {
      name,
      value,
      part,
      valName,
      typeOfPlan,
    },
  };
}

export function getDefaultValuesEditPlanLife(section, plan, countClasses) {
  return {
    meta: {
      section,
    },
    type: types.GET_DEFAULT_VALUES_EDIT_PLAN_LIFE,
    payload: plan,
    countClasses,
  };
}

export function searchText(section, searchString) {
  return {
    meta: {
      section,
    },
    type: types.PLANS_SEARCH,
    payload: {
      searchString: searchString ? searchString.toLowerCase() : '',
    },
  };
}

export function closeViolationModal(section, id) {
  return {
    meta: { section },
    type: types.VIOLATION_MODAL_CLOSE,
    payload: id,
  };
}

export function getAlternativePlansForDropdown(section) {
  return {
    meta: { section },
    type: types.GET_ALT_PLANS_FOR_DROPDOWN,
    payload: {},
  };
}

export function changePlanLabelName(section, rfpQuoteOptionId, displayName, rfpQuoteAncillaryOptionId) {
  return {
    meta: { section },
    type: types.PLAN_LABEL_CHANGE,
    payload: { rfpQuoteOptionId, displayName, rfpQuoteAncillaryOptionId },
  };
}

export function selectPlanBroker(section, planId, networkId, index) {
  return {
    meta: {
      section,
    },
    type: types.PLAN_SELECT_BROKER,
    payload: {
      rfpQuoteNetworkPlanId: planId,
      rfpQuoteOptionNetworkId: networkId,
      index,
    },
  };
}

export function getPlansListForFilterCompare(clientId) {
  return {
    meta: {},
    type: types.GET_PLANS_LIST_FOR_FILTER_COMPARE,
    payload: {
      clientId,
    },
  };
}

export function changeSelectedSection(section) {
  return {
    meta: {},
    type: types.CHANGE_SELECTED_SECTION,
    payload: section,
  };
}

export function changeSelectedClientPlanId(plan) {
  return {
    meta: {},
    type: types.CHANGE_SELECTED_CLIENT_PLAN_ID,
    payload: plan,
  };
}

export function changeSelectedClientPlanCarrier(carriersSelected) {
  return {
    meta: {},
    type: types.CHANGE_SELECTED_CARRIERS,
    payload: carriersSelected,
  };
}

export function selectSecondPlan(section, plan, rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, actionType, index) {
  return {
    meta: {
      section,
    },
    type: PLAN_SECOND_SELECT,
    payload: { plan, rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, actionType, index },
  };
}

export function updateComparePlansList(product, carrierIds, clientPlanId, clientId) {
  return {
    meta: {},
    type: types.GET_PLANS_FOR_COMPARE,
    payload: { product, carrierIds, clientPlanId, clientId },
  };
}

export function downloadComparePlansList(product, carrierIds, clientPlanId, clientId) {
  return {
    meta: {},
    type: types.PLANS_COMPARE_DOWNLOAD,
    payload: { product, carrierIds, clientPlanId, clientId },
  };
}

export function setNewPlanBenefits(section, pnnId) {
  return {
    meta: { section },
    type: types.GET_PLAN_FOR_BENEFITS,
    payload: { pnnId },
  };
}

export function setNewRxPlanBenefits(section, pnnId) {
  return {
    meta: { section },
    type: types.GET_RX_PLAN_FOR_BENEFITS,
    payload: { pnnId },
  };
}

export function changeAccordion(accordionActiveIndex) {
  return {
    type: types.CHANGE_ACCORDION_INDEX,
    payload: { accordionActiveIndex },
  };
}

export function getPlansBenefits(networkId) {
  return {
    meta: {},
    type: types.GET_PLANS_FOR_SELECT_BENEFITS,
    payload: { networkId },
  };
}

export function getRxPlansBenefits(networkId) {
  return {
    meta: {},
    type: types.GET_RX_PLANS_FOR_SELECT_BENEFITS,
    payload: { networkId },
  };
}

export function changeSelectedRx(section, plan) {
  return {
    type: types.CHANGE_SELECTED_RX,
    meta: { section },
    payload: { plan },
  };
}

export function changeSelectedPlan(section, plan) {
  return {
    type: types.CHANGE_SELECTED_PLAN,
    meta: { section },
    payload: { plan },
  };
}
