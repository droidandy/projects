import { fromJS } from 'immutable';
import {
  PLANS_GET,
  PLANS_GET_SUCCESS,
  PLANS_GET_ERROR,
  PLAN_SELECT,
  PLAN_SECOND_SELECT,
  DATA_REFRESHED,
  OPTION_NETWORK_CHANGE_SUCCESS,
  OPTION_NETWORK_ADD_SUCCESS,
  PLAN_SELECT_SUCCESS,
} from '@benrevo/benrevo-react-quote';

import * as types from '../constants';
import { checkViolation } from '../carrierGuidelineViolation';

export function alternativesGet(state, action) {
  return state
    .setIn([action.meta.section, 'planTemplate'], fromJS({}))
    .setIn([action.meta.section, 'alternativesLoading'], true)
    .setIn([action.meta.section, 'alternativePlans'], fromJS([]));
}

export function alternativesGetSuccess(state, action) {
  const alternativesPlans = action.payload.plans || [];
  const alternativesRx = action.payload.rx || [];
  let planTemplate = {};
  const alternativePlans = [];
  let altPlan = state.getIn([action.meta.section, 'altPlan']) ? state.getIn([action.meta.section, 'altPlan']).toJS() : {};
  const newPlan = state.getIn([action.meta.section, 'newPlan']).toJS();
  // state.getIn([action.meta.section, 'altPlan', 'selected']) ? {} : state.getIn([action.meta.section, 'altPlan']).toJS();
  let currentPlan = {};
  let selectedPlan = state.getIn([action.meta.section, 'selectedPlan']);
  let matchPlan = state.getIn([action.meta.section, 'matchPlan']);
  //
  if (alternativesPlans && alternativesPlans.length) {
    // set first column template
    planTemplate = alternativesPlans[0]; // eslint-disable-line
    for (let index = 0; index < alternativesPlans.length; index += 1) {
      const plan = alternativesPlans[index];
      // set altPlan
      if (plan.rfpQuoteNetworkPlanId === newPlan.rfpQuoteNetworkPlanId && !plan.selected) {
        altPlan = plan;
      }
      // plans for dropdown in alternatives array
      if ((plan.type === 'alternative' || plan.type === 'matchPlan' || plan.type === 'primaryPlan') && !plan.selected) {
        alternativePlans.push(plan);
      }
      if (plan.type === 'current' && !plan.selected) {
        currentPlan = fromJS(plan);
      }
      if (!matchPlan.has('benefits') && plan.type === 'matchPlan' && !plan.selected) {
        matchPlan = fromJS(plan);
      }
      if (plan.selected) {
        selectedPlan = fromJS(plan);
      }
    }
  }
  if (Object.keys(currentPlan).length) {
    return state
      .setIn([action.meta.section, 'allRx'], fromJS(alternativesRx))
      .setIn([action.meta.section, 'allPlans'], fromJS(alternativesPlans))
      .setIn([action.meta.section, 'planTemplate'], fromJS(planTemplate))
      .setIn([action.meta.section, 'alternativePlans'], fromJS(alternativePlans))
      .setIn([action.meta.section, 'altPlan'], fromJS(altPlan))
      .setIn([action.meta.section, 'currentPlan'], fromJS(currentPlan))
      .setIn([action.meta.section, 'selectedPlan'], fromJS(selectedPlan))
      .setIn([action.meta.section, 'matchPlan'], fromJS(matchPlan))
      .setIn([action.meta.section, 'matchSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selected) || {}))
      .setIn([action.meta.section, 'matchSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.selected) || {}))
      .setIn([action.meta.section, 'unchangedFirstSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selected) || {}))
      .setIn([action.meta.section, 'unchangedFirstSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.selected) || {}))
      .setIn([action.meta.section, 'unchangedSecondSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selectedSecond) || {}))
      .setIn([action.meta.section, 'unchangedSecondSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.secondSelected) || {}));
  }
  return state
    .setIn([action.meta.section, 'allRx'], fromJS(alternativesRx))
    .setIn([action.meta.section, 'allPlans'], fromJS(alternativesPlans))
    .setIn([action.meta.section, 'planTemplate'], fromJS(planTemplate))
    .setIn([action.meta.section, 'alternativePlans'], fromJS(alternativePlans))
    .setIn([action.meta.section, 'altPlan'], fromJS(altPlan))
    .setIn([action.meta.section, 'selectedPlan'], fromJS(selectedPlan))
    .setIn([action.meta.section, 'matchPlan'], fromJS(matchPlan))
    .setIn([action.meta.section, 'matchSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selected) || {}))
    .setIn([action.meta.section, 'matchSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.selected) || {}))
    .setIn([action.meta.section, 'unchangedFirstSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selected) || {}))
    .setIn([action.meta.section, 'unchangedFirstSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.selected) || {}))
    .setIn([action.meta.section, 'unchangedSecondSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selectedSecond) || {}))
    .setIn([action.meta.section, 'unchangedSecondSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.secondSelected) || {}));
}

export function alternativesGetError(state, action) {
  return state
    .setIn([action.meta.section, 'allRx'], fromJS([]))
    .setIn([action.meta.section, 'allPlans'], fromJS([]))
    .setIn([action.meta.section, 'planTemplate'], fromJS({}))
    .setIn([action.meta.section, 'alternativePlans'], fromJS([]))
    .setIn([action.meta.section, 'altPlan'], fromJS({}))
    .setIn([action.meta.section, 'currentPlan'], fromJS({}))
    .setIn([action.meta.section, 'selectedPlan'], fromJS({}))
    .setIn([action.meta.section, 'matchPlan'], fromJS({}));
}

export function clearAlternatives(state, action) {
  return state
    .setIn([action.meta.section, 'allRx'], fromJS([]))
    .setIn([action.meta.section, 'newPlan'], fromJS({}))
    .setIn([action.meta.section, 'allPlans'], fromJS([]))
    .setIn([action.meta.section, 'alternativesPlans'], fromJS({}))
    .setIn([action.meta.section, 'alternativePlans'], fromJS([]))
    .setIn([action.meta.section, 'altPlan'], fromJS({}))
    .setIn([action.meta.section, 'currentPlan'], fromJS({}))
    .setIn([action.meta.section, 'selectedPlan'], fromJS({}))
    .setIn([action.meta.section, 'matchPlan'], fromJS({}));
}

export function addAlternativePlan(state, action) {
  const { plan, actionType, rfpQuoteNetworkPlanId } = action.payload;
  const { section } = action.meta;
  const currentAltPlan = state.getIn([section, 'altPlan']).toJS();
  if (actionType === 'select' && rfpQuoteNetworkPlanId && currentAltPlan.rfpQuoteNetworkPlanId !== rfpQuoteNetworkPlanId) {
    return state
      .setIn([section, 'altPlan'], fromJS(plan));
  }
  // rfpQuoteNetworkPlanId
  const openedOption = state.getIn([section, 'openedOption']).toJS();
  let ind = null;
  if (openedOption.detailedPlans && openedOption.detailedPlans.length) {
    openedOption.detailedPlans.forEach((detailedPlan, index) => {
      if (detailedPlan.secondRfpQuoteNetworkPlanId === rfpQuoteNetworkPlanId) {
        ind = index;
      }
    });
  }
  if (ind !== null) {
    return state
      .setIn([section, 'openedOption', 'detailedPlans', ind, 'secondNewPlan'], fromJS({}))
      .setIn([section, 'altPlan'], fromJS({}));
  }
  return state
    .setIn([section, 'altPlan'], fromJS({}));
}

export function setPlanTemplate(state, action) {
  const { data, type } = action.payload;
  const { section } = action.meta;
  const planTypeTemplates = state.get(section).get('planTypeTemplates').toJS();
  planTypeTemplates[type] = data;
  return state
    .setIn([action.meta.section, 'planTypeTemplates'], fromJS(planTypeTemplates));
}

/* export function alternativePlanAddSuccess(state, action) {
  const { section } = action.meta;
  const { status } = action;
  const newPlan = state.get(section).get('newPlan').toJS();
  newPlan.rfpQuoteNetworkPlanId = action.payload;
  newPlan.name = newPlan.nameByNetwork;
  newPlan.rfpQuoteNetworkPlanId = action.payload;
  if (status === 'newAlt') {
    return state
      .setIn([action.meta.section, 'altPlan'], fromJS(newPlan));
  }
  return state;
} */

export function planFavouriteChange(state, action) {
  const { section } = action.meta;
  const { favorite, rfpQuoteNetworkPlanId } = action.payload;
  const altPlans = state.getIn([section, 'alternativesPlans', 'plans']).toJS();
  if (altPlans.length > 0) {
    altPlans.forEach((plan, ind) => {
      if (plan.rfpQuoteNetworkPlanId === rfpQuoteNetworkPlanId) {
        altPlans[ind].favorite = typeof favorite === 'undefined' ? true : !favorite;
      }
    });
  }
  return state
    .setIn([section, 'allPlans'], fromJS(altPlans))
    .setIn([section, 'alternativesPlans', 'plans'], fromJS(altPlans));
}

export function clearAlternativePlan(state, action) {
  const { section } = action.meta;
  return state
    .setIn([section, 'altPlan'], fromJS({}));
}

export function editPlanField(state, action) {
  const { section } = action.meta;
  const {
    name,
    value,
    part,
    valName,
  } = action.payload;
  if (name === 'planName') {
    return state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'name'], part);
  }
  if (name.toString().indexOf('two') >= 0) {
    return state
    .set('planSavingFailed', false)
    .set('planChanged', true)
    .setIn([action.meta.section, 'newPlan', part, parseInt(name, 10), `${valName}Two`], value);
  }
  if (name.toString().indexOf('three') >= 0) {
    return state
    .set('planSavingFailed', false)
    .set('planChanged', true)
    .setIn([action.meta.section, 'newPlan', part, parseInt(name, 10), `${valName}Three`], value);
  }
  if (name.toString().indexOf('four') >= 0) {
    return state
    .set('planSavingFailed', false)
    .set('planChanged', true)
    .setIn([action.meta.section, 'newPlan', part, parseInt(name, 10), `${valName}Four`], value);
  }
  return state
    .set('planSavingFailed', false)
    .set('planChanged', true)
    .setIn([action.meta.section, 'newPlan', part, name, valName], value);
}

export function editVolPlanField(state, action) {
  const { section } = action.meta;
  const {
    name,
    value,
    part,
    valName,
  } = action.payload;
  // console.log('editVolPlanField', action);
  if (name === 'planName') {
    return state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'name'], part);
  }
  if (part === 'ages') {
    return state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'rates', 'ages', valName, name], value);
  }
  if (part === 'classes') {
    return state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'classes', name, valName], value);
  }
  return state
    .set('planSavingFailed', false)
    .set('planChanged', true)
    .setIn([section, 'newPlan', part, valName], value);
}


export function planStartSelect(state, action) {
  return state
    .setIn([action.meta.section, 'alternativesLoading'], true);
}

export function searchTextFromPlans(state, action) {
  const { section } = action.meta;
  const { searchString } = action.payload;
  const alternativesPlans = state.getIn([section, 'alternativesPlans']).toJS();
  const allPlans = alternativesPlans.plans || [];
  let resultPlans = allPlans;
  if (allPlans.length > 0) {
    resultPlans = allPlans.filter((planItem) => {
      if (planItem.name.toLowerCase().includes(searchString)) {
        return planItem;
      }
      if (planItem.cost && planItem.cost[1] && planItem.cost[1].value && planItem.cost[1].value.toLowerCase().includes(searchString)) {
        return planItem;
      }
      if (planItem.benefits && planItem.benefits.length > 0) {
        let flag = false;
        planItem.benefits.forEach((benefit) => {
          if (benefit.value && benefit.value.toLowerCase().includes(searchString)) {
            flag = true;
          }
          if (benefit.valueIn && benefit.valueIn.toLowerCase().includes(searchString)) {
            flag = true;
          }
          if (benefit.valueOut && benefit.valueOut.toLowerCase().includes(searchString)) {
            flag = true;
          }
          return flag;
        });
        if (flag) {
          return planItem;
        }
      }
      return null;
    });
  }
  return state
    .setIn([section, 'allPlans'], fromJS(resultPlans));
}

export function violationModalClose(state, action) {
  const id = action.payload;
  const violationMessage = state.getIn([action.meta.section, 'violationModalText', id]).toJS();
  violationMessage.status = false;
  return state
    .setIn([action.meta.section, 'violationModalText', id], fromJS(violationMessage));
}

export function setPlanViolation(state, action) {
  const { section } = action.meta;
  const { optionId, violationStatus } = action.payload;
  return state
    .setIn([section, 'violationNotification', optionId], violationStatus);
}

export function getPlansForDropdown(state, action) {
  const { section } = action.meta;
  return state
    .setIn([section, 'plansForDropDownLoading'], true);
}

export function setAltPlansForDropdown(state, action) {
  const { section } = action.meta;
  const { data } = action.payload;
  const plansForDropDown = {};
  if (data && data.length > 0) {
    data.forEach((item) => {
      plansForDropDown[item.rfpQuoteNetworkId] = item.plans;
    });
  }
  return state
    .setIn([section, 'plansForDropDownLoading'], false)
    .setIn([section, 'plansForDropDown'], fromJS(plansForDropDown));
}

export function clearAltPlansForDropdown(state, action) {
  const { section } = action.meta;
  const { rfpQuoteOptionNetworkId } = action.payload;
  return state
    .setIn([section, 'plansForDropDownLoading'], false)
    .setIn([section, 'plansForDropDown', rfpQuoteOptionNetworkId], fromJS([]));
}

export function planLabelChange(state, action) {
  const { section } = action.meta;
  return state
    .setIn([section, 'optionNameLoading'], true);
}

export function planLabelChangeError(state, action) {
  const { section } = action.meta;
  return state
    .setIn([section, 'optionNameLoading'], false);
}

export function planLabelChanged(state, action) {
  const { section } = action.meta;
  const { displayName } = action.payload;
  const openedOption = state.get(section).get('openedOption').toJS();
  if (openedOption.displayName) openedOption.displayName = displayName;
  else if (openedOption.detailedPlan) openedOption.detailedPlan.displayName = displayName;
  return state
    .setIn([section, 'openedOption'], fromJS(openedOption))
    .setIn([section, 'optionNameLoading'], false);
}

export function changeSelectedPlan(state, action) {
  const { section } = action.meta;
  const { index, rfpQuoteNetworkPlanId } = action.payload;
  const openedOption = state.getIn([section, 'openedOption']).toJS();
  if (openedOption) {
    const page = state.get(section).get('page').toJS();
    const carrierName = page.carrier ? page.carrier.carrier.name : '';
    const violationMessage = checkViolation(carrierName, openedOption);
    const violationStatus = violationMessage.status;
    const detailedPlan = openedOption.detailedPlans[index] || null;
    if (detailedPlan) {
      detailedPlan.rfpQuoteNetworkPlanId = rfpQuoteNetworkPlanId;
      return state
        .setIn([section, 'violationModalText', openedOption.id], fromJS(violationMessage))
        .setIn([section, 'violationNotification', openedOption.id], violationStatus)
        .setIn([section, 'alternativesLoading'], false)
        .setIn([section, 'openedOption', 'detailedPlans', index], fromJS(detailedPlan));
    }
  }
  return state;
}

export function checkOptionViolation(state, action) {
  const { section } = action.meta;
  const openedOption = action.payload.data;
  if (openedOption) {
    const page = state.get(section).get('page').toJS();
    const carrierName = page.carrier.carrier && page.carrier.carrier.name ? page.carrier.carrier.name : '';
    const violationMessage = checkViolation(carrierName, openedOption);
    const violationStatus = violationMessage.status;
    return state
      .setIn([section, 'violationModalText', openedOption.id], fromJS(violationMessage))
      .setIn([section, 'violationNotification', openedOption.id], violationStatus);
  }
  return state;
}

export function setListOfPlansForCompare(state, action) {
  const { data } = action.payload;
  return state
    .setIn(['comparePlans', 'clientPlans'], fromJS(data))
    .setIn(['comparePlans', 'clientPlansLoading'], false);
}

export function changeSelectedSection(state, action) {
  return state
    .setIn(['comparePlans', 'allOptionsToCompare'], fromJS([]))
    .setIn(['comparePlans', 'allPlansToCompare'], fromJS([]))
    .setIn(['comparePlans', 'clientPlanCarriersSelected'], fromJS([]))
    .setIn(['comparePlans', 'clientPlanSelected'], null)
    .setIn(['comparePlans', 'sectionSelected'], fromJS(action.payload));
}

export function setLoadingOfPlansForCompare(state) {
  const clientPlanSelected = state.get('comparePlans').get('clientPlanSelected');
  if (!clientPlanSelected) {
    return state;
  }
  return state
    .setIn(['comparePlans', 'clientPlansLoading'], true);
}

export function clearCompareData(state) {
  return state
    .setIn(['comparePlans', 'allOptionsToCompare'], fromJS([]))
    .setIn(['comparePlans', 'allPlansToCompare'], fromJS([]))
    .setIn(['comparePlans', 'clientPlanCarriersSelected'], fromJS([]))
    .setIn(['comparePlans', 'clientPlanSelected'], null)
    .setIn(['comparePlans', 'sectionSelected'], fromJS('MEDICAL'));
}

export function stopLoadingOfPlansForCompare(state) {
  return state
    .setIn(['comparePlans', 'planFilterChanged'], false)
    .setIn(['comparePlans', 'clientPlansLoading'], false);
}

export function changeSelectedPlanId(state, action) {
  return state
    .setIn(['comparePlans', 'planFilterChanged'], true)
    .setIn(['comparePlans', 'clientPlanSelected'], fromJS(action.payload ? action.payload : {}));
}

export function changeSelectedCarriers(state, action) {
  return state
    .setIn(['comparePlans', 'planFilterChanged'], true)
    .setIn(['comparePlans', 'clientPlanCarriersSelected'], fromJS(action.payload));
}

export function setPlansForCompare(state, action) {
  const ancillaryProducts = ['life', 'vol_life', 'ltd', 'vol_ltd', 'std', 'vol_std'];
  const { data } = action.payload;
  const { product } = action.meta;
  const allPlansToCompare = [];
  const allOptionsToCompare = [];
  if (data && data.length > 0) {
    if (ancillaryProducts.includes(product.toLowerCase())) {
      data.forEach((plan) => {
        allPlansToCompare.push(plan);
        allOptionsToCompare.push({
          name: plan.carrierName,
        });
      });
    } else {
      data.forEach((carrier) => {
        // allPlansToCompare = allPlansToCompare.concat(carrier.plans);
        if (carrier.plans && carrier.plans.length) {
          carrier.plans.forEach((plan) => {
            if (plan.networkPlan) {
              allPlansToCompare.push(plan.networkPlan);
              allOptionsToCompare.push({
                name: carrier.name,
              });
            }
          });
        }
      });
    }
  }
  return state
    .setIn(['comparePlans', 'planFilterChanged'], false)
    .setIn(['comparePlans', 'clientPlansLoading'], false)
    .setIn(['comparePlans', 'allOptionsToCompare'], fromJS(allOptionsToCompare))
    .setIn(['comparePlans', 'allPlansToCompare'], fromJS(allPlansToCompare));
}

export function setPlansBenefitsForDropdown(state, action) {
  const { data } = action.payload;
  return state
    .setIn(['plansForImportBenefits'], fromJS(data));
}

export function setRxPlansBenefitsForDropdown(state, action) {
  const { data } = action.payload;
  return state
    .setIn(['rxPlansForImportBenefits'], fromJS(data));
}

export function setBenefitsLoading(state, action) {
  const { section } = action.meta;
  const { pnnId } = action.payload;
  if (pnnId !== 'addPlan') {
    return state
      .setIn(['benefitsLoading'], true);
  }
  return state
    .setIn(['benefitsLoading'], false)
    .setIn([section, 'newPlan', 'pnnId'], 'addPlan');
}

export function unsetBenefitsLoading(state, action) {
  const { section } = action.meta;
  return state
    .setIn([section, 'newPlan'], fromJS({}))
    .setIn(['benefitsLoading'], false);
}

export function setNewPlanBenefits(state, action) {
  const { section } = action.meta;
  const { data } = action.payload;
  if (data.rx && data.rx.length > 0) {
    return state
      .setIn(['benefitsLoading'], false)
      .setIn([section, 'newPlan', 'pnnId'], data.pnnId)
      .setIn([section, 'newPlan', 'nameByNetwork'], data.name)
      .setIn([section, 'newPlan', 'benefits'], fromJS(data.benefits))
      .setIn([section, 'newPlan', 'rx'], fromJS(data.rx));
  }
  return state
    .setIn(['benefitsLoading'], false)
    .setIn([section, 'newPlan', 'pnnId'], data.pnnId)
    .setIn([section, 'newPlan', 'nameByNetwork'], data.name)
    .setIn([section, 'newPlan', 'benefits'], fromJS(data.benefits));
}

export function setNewRxPlanBenefits(state, action) {
  const { section } = action.meta;
  const { data } = action.payload;
  return state
    .setIn(['benefitsLoading'], false)
    .setIn([section, 'newPlan', 'pnnRxId'], data.pnnId)
    .setIn([section, 'newPlan', 'rx'], fromJS(data.rx));
}

export function setSelectedPlan(state, action) {
  const { section } = action.meta;
  return state
    .setIn([section, 'altPlan'], fromJS({}))
    .setIn([section, 'alternativesLoading'], true);
}

export function selectAllCarriers(state, action) {
  const { section } = action.meta;
  const allCarriers = action.payload;
  const selectedCarriers = [];
  if (allCarriers && allCarriers.length && section === 'medical') {
    allCarriers.forEach((carrier) => {
      selectedCarriers.push(carrier.carrier.carrierId);
    });
    return state
      .setIn(['comparePlans', 'clientPlanCarriersSelected'], fromJS(selectedCarriers));
  }
  return state;
}

export function changeAccordion(state, action) {
  const { accordionActiveIndex } = action.payload;
  return state
    .setIn(['accordionActiveIndex'], fromJS(accordionActiveIndex));
}

export function changeSelectedRx(state, action) {
  const { plan } = action.payload;
  const { section } = action.meta;
  return state
    .setIn([section, 'matchSelectedRxPlan'], fromJS(plan));
}

export function changeSelectedPlanChosen(state, action) {
  const { plan } = action.payload;
  const { section } = action.meta;
  return state
    .setIn([section, 'matchSelectedPlan'], fromJS(plan));
}

export default function reducer(state = [], action) {
  switch (action.type) {
    case types.CLEAR_ALTERNATIVES: return clearAlternatives(state, action);
    case PLAN_SECOND_SELECT: return addAlternativePlan(state, action);
    case PLANS_GET: return alternativesGet(state, action);
    case PLANS_GET_SUCCESS: return alternativesGetSuccess(state, action);
    case PLANS_GET_ERROR: return alternativesGetError(state, action);
    case types.PLAN_TEMPLATE_GET_SUCCESS: return setPlanTemplate(state, action);
    // case ALTERNATIVE_PLAN_ADD_SUCCESS: return alternativePlanAddSuccess(state, action);
    case types.PLAN_FAVOIRITE_CHANGE: return planFavouriteChange(state, action);
    case types.CLEAR_ALT_PLAN: return clearAlternativePlan(state, action);
    case types.ALTERNATIVE_PLAN_VALUE_EDIT: return editPlanField(state, action);
    case types.VOL_PLAN_VALUE_EDIT: return editVolPlanField(state, action);
    case PLAN_SELECT: return planStartSelect(state, action);
    case types.PLANS_SEARCH: return searchTextFromPlans(state, action);
    case types.VIOLATION_MODAL_CLOSE: return violationModalClose(state, action);
    case types.SET_PLAN_VIOLATION: return setPlanViolation(state, action);
    case types.GET_ALT_PLANS_FOR_DROPDOWN: return getPlansForDropdown(state, action);
    case types.GET_ALT_PLANS_FOR_DROPDOWN_SUCCESS: return setAltPlansForDropdown(state, action);
    case types.GET_ALT_PLANS_FOR_DROPDOWN_ERROR: return clearAltPlansForDropdown(state, action);
    case types.PLAN_LABEL_CHANGE: return planLabelChange(state, action);
    case types.PLAN_LABEL_CHANGE_SUCCESS: return planLabelChanged(state, action);
    case types.PLAN_LABEL_CHANGE_ERROR: return planLabelChangeError(state, action);
    case types.PLAN_SELECT_BROKER: return changeSelectedPlan(state, action);
    case DATA_REFRESHED: return checkOptionViolation(state, action);
    case OPTION_NETWORK_CHANGE_SUCCESS: return checkOptionViolation(state, action);
    case OPTION_NETWORK_ADD_SUCCESS: return checkOptionViolation(state, action);
    case types.CHANGE_SELECTED_SECTION: return changeSelectedSection(state, action);
    case types.GET_PLANS_LIST_FOR_FILTER_COMPARE: return clearCompareData(state, action);// return setLoadingOfPlansForCompare(state, action);
    case types.GET_PLANS_LIST_FOR_FILTER_COMPARE_SUCCESS: return setListOfPlansForCompare(state, action);
    case types.CHANGE_SELECTED_CLIENT_PLAN_ID: return changeSelectedPlanId(state, action);
    case types.CHANGE_SELECTED_CARRIERS: return changeSelectedCarriers(state, action);
    case types.GET_PLANS_FOR_COMPARE: return setLoadingOfPlansForCompare(state, action);
    case types.GET_PLANS_FOR_COMPARE_SUCCESS: return setPlansForCompare(state, action);
    case types.GET_PLANS_FOR_COMPARE_ERROR: return stopLoadingOfPlansForCompare(state, action);
    case types.GET_PLANS_FOR_SELECT_BENEFITS_SUCCESS: return setPlansBenefitsForDropdown(state, action);
    case types.GET_RX_PLANS_FOR_SELECT_BENEFITS_SUCCESS: return setRxPlansBenefitsForDropdown(state, action);
    case types.GET_PLAN_FOR_BENEFITS: return setBenefitsLoading(state, action);
    case types.GET_PLAN_FOR_BENEFITS_SUCCESS: return setNewPlanBenefits(state, action);
    case types.GET_RX_PLAN_FOR_BENEFITS_SUCCESS: return setNewRxPlanBenefits(state, action);
    case types.GET_PLAN_FOR_BENEFITS_ERROR: return unsetBenefitsLoading(state, action);
    case PLAN_SELECT_SUCCESS: return setSelectedPlan(state, action);
    case types.GET_CARRIERS_SUCCESS: return selectAllCarriers(state, action);
    case types.CHANGE_ACCORDION_INDEX: return changeAccordion(state, action);
    case types.CHANGE_SELECTED_RX: return changeSelectedRx(state, action);
    case types.CHANGE_SELECTED_PLAN: return changeSelectedPlanChosen(state, action);
    default: return state;
  }
}
