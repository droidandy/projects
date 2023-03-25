import { fromJS } from 'immutable';
import RX from '../AlternativesFeature/components/RX';
// import { initialPresentationMasterState } from './state';
import * as types from '../constants';

export function alternativePlanValueChange(state, action) {
  if (action.payload.status === 'edit') {
    if (action.payload.name === 'planName') {
      return state
        .set('planSavingFailed', false)
        .set('planChanged', true)
        .setIn([action.meta.section, 'stateAlternativesPlans', 'plans', action.payload.planIndex, 'name'], action.payload.part);
    }
    return state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([action.meta.section, 'stateAlternativesPlans', (!action.payload.externalRX) ? 'plans' : 'rx', action.payload.planIndex, action.payload.part, action.payload.name, action.payload.valName], action.payload.value);
  }
  if (action.payload.name === 'newPlan') {
    return state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([action.meta.section, 'newPlan'], fromJS(action.payload.value));
  }
  // changing name of plan
  if (action.payload.name === 'planName') {
    if (action.payload.status === 'edit') {
      return state;
    }
    return state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([action.meta.section, 'newPlan', action.payload.value], action.payload.part);
  }
  return state
    .set('planSavingFailed', false)
    .set('planChanged', true)
    .setIn([action.meta.section, 'newPlan', action.payload.part, action.payload.name, action.payload.valName], action.payload.value);
}

export function getDefaultValuesEditPlanLife(state, action) {
  const benefits = action.payload.benefits;
  const costs = action.payload.cost;
  const classes = action.payload.classes;
  const countClasses = action.countClasses;
  if (countClasses === 3 && classes.length !== 3) {
    classes.push(
        Object.keys(classes[0]).reduce((acc, key) => ({ ...acc, [key]: null }), {}),
    );
  }
  if (countClasses === 4 && classes.length !== 4) {
    classes.push(
        Object.keys(classes[0]).reduce((acc, key) => ({ ...acc, [key]: null }), {}),
    );
  }
  const newBenefits = benefits.map((benefit) => {
    const key = benefit.key;
    const newBenefit = { ...benefit };
    classes.forEach(
      (item, index) => {
        if (index === 0) {
          newBenefit.value = item[key] || null;
        }
        if (index === 1) {
          newBenefit.valueTwo = item[key] || null;
        }
        if (index === 2) {
          newBenefit.valueThree = item[key] || null;
        }
        if (index === 3) {
          newBenefit.valueFour = item[key] || null;
        }
      }
    );
    return newBenefit;
  });
  const newRates = costs.map((cost) => {
    const key = cost.key;
    const newBenefit = { ...cost };
    if (action.payload.rates[key]) newBenefit.value = action.payload.rates[key] || null;
    return newBenefit;
  });
  return state
  .setIn([action.meta.section, 'newPlan', 'cost'], fromJS(newRates))
  .setIn([action.meta.section, 'newPlan', 'benefits'], fromJS(newBenefits));
}

export function alternativePlanDeleteSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], true);
}

export function alternativePlanAdd(state, action) {
  return state
    .set('loading', true)
    .setIn([action.meta.section, 'alternativesLoading'], true)
    .set('planChanged', true);
}

export function alternativePlanAddSuccess(state, action) {
  return state
    .set('planSavesSuccess', true)
    .set('planSavingFailed', false)
    .set('loading', false)
    .setIn([action.meta.section, 'newPlan', 'rfpQuoteNetworkPlanId'], action.payload);
}

export function alternativePlanAddError(state) {
  return state
    .set('planSavesSuccess', false)
    .set('planSavingFailed', true)
    .set('loading', false);
}

export function setStateAlternativePlans(state, action) {
  return state
    .setIn([action.meta.section, 'stateAlternativesPlans'], fromJS(action.payload.stateAlternativesPlans));
}

export function saveCurrentPlan(state, action) {
  let plans = state.get(action.meta.section).get('alternativesPlans');
  plans = plans.setIn([(!action.payload.externalRX) ? 'plans' : 'rx', action.payload.index], fromJS(action.payload.externalRX || action.payload.plan));
  return state
    .setIn([action.meta.section, 'alternativesPlans'], plans);
}

export function plansGet(state, action) {
  return state
    .set('loading', true)
    .setIn([action.meta.section, 'loading'], true)
    .setIn([action.meta.section, 'alternativesLoading'], true)
    .setIn([action.meta.section, 'alternativesPlans'], fromJS({
      plans: [],
      rx: [],
    }));
  // .setIn([action.meta.section, 'alternativesPlans'], initialPresentationMasterState.get(action.meta.section).get('alternativesPlans'));
}

export function loadingAfterSelect(state, action) {
  return state
    .setIn([action.meta.section, 'loadingAfterSelect'], true);
}

export function plansGetSuccess(state, action) {
  const plans = action.payload;
  if (action.meta.section === types.PLAN_TYPE_MEDICAL && plans.plans && !plans.rx.length) {
    for (let i = 0; i < plans.plans.length; i += 1) {
      const plan = plans.plans[i];

      if (!plan.rx || !plan.rx.length) {
        plan.rx = [...RX.benefits];
      }
    }
  }

  const filters = state.getIn([action.meta.section, 'filter']).toJS();
  const minMaxVals = state.getIn([action.meta.section, 'minMaxVals']).toJS();
  /* You get all min and max values when filters is empty */
  if (filters.coinsuranceFrom === null && filters.coinsuranceTo === null &&
      filters.copayFrom === null && filters.copayTo === null &&
      filters.deductibleFrom === null && filters.deductibleTo === null &&
      filters.diffPercentTo === null && filters.diffPercentTo === null) {
    const allPlans = plans.plans;
    let minCopay = Infinity;
    let maxCopay = -Infinity;
    let minCoIns = Infinity;
    let maxCoIns = -Infinity;
    for (let i = 0; i < allPlans.length; i += 1) {
      if (allPlans[i].benefits) {
        const tmp = allPlans[i].benefits.filter((x) => x.sysName === 'PCP')[0];
        const tmpCoIns = allPlans[i].benefits.filter((x) => x.sysName === 'CO_INSURANCE')[0];
        if (tmp) {
          const tmpVal = tmp.valueIn || tmp.value;
          if (tmpVal > maxCopay) {
            maxCopay = tmpVal;
          }
          if (tmpVal < minCopay) {
            minCopay = tmpVal;
          }
        }
        if (tmpCoIns) {
          const tmpCoInsVal = tmpCoIns.valueIn || tmpCoIns.value;
          if (tmpCoInsVal > maxCoIns) {
            maxCoIns = tmpCoInsVal;
          }
          if (tmpCoInsVal < minCoIns) {
            minCoIns = tmpCoInsVal;
          }
        }
      }
    }
    minMaxVals.minCopay = (minCopay === Infinity ? 0 : minCopay);
    minMaxVals.maxCopay = (maxCopay === -Infinity ? 35 : maxCopay);
    minMaxVals.minCoinsurance = (minCoIns === Infinity ? 0 : minCoIns);
    minMaxVals.maxCoinsurance = (maxCoIns === -Infinity ? 35 : maxCoIns);
  }

  return state
    .setIn([action.meta.section, 'loadingAfterSelect'], false)
    .setIn([action.meta.section, 'loading'], false)
    .setIn([action.meta.section, 'alternativesLoading'], false)
    .setIn([action.meta.section, 'plansGetSuccess'], true)
    .setIn([action.meta.section, 'plansGetError'], false)
    .setIn([action.meta.section, 'stateAlternativesPlans'], fromJS(plans))
    .setIn([action.meta.section, 'alternativesPlans'], fromJS(plans))
    .setIn([action.meta.section, 'minMaxVals'], fromJS(minMaxVals));
}

export function plansGetError(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], false)
    .setIn([action.meta.section, 'plansGetSuccess'], false)
    .setIn([action.meta.section, 'alternativesLoading'], false)
    .setIn([action.meta.section, 'plansGetError'], true);
}

export function setAlternativesFilters(state, action) {
  return state
    .setIn([action.meta.section, 'filter'], fromJS(action.payload));
}

export function clearAlternativesFilters(state, action) {
  const filter = {
    favourite: false,
    diffPercentFrom: null,
    diffPercentTo: null,
    copayFrom: null,
    copayTo: null,
    deductibleFrom: null,
    deductibleTo: null,
    coinsuranceFrom: null,
    coinsuranceTo: null,
  };
  return state
    .setIn([action.meta.section, 'filter'], fromJS(filter));
}

export function setDataForNewProducts(state, action) {
  const { data } = action.payload;
  data.newPlan = {};
  data.currentPlan = {};
  data.selectedPlan = {};
  data.secondNewPlan = {};

  return state
    .setIn([action.meta.section, 'page', 'id'], data.rfpQuoteAncillaryOptionId)
    .setIn([action.meta.section, 'openedOption', 'detailedPlan'], fromJS(data));
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.ALTERNATIVE_PLAN_VALUE_CHANGE: return alternativePlanValueChange(state, action);
    case types.ALTERNATIVE_PLAN_DELETE_SUCCESS: return alternativePlanDeleteSuccess(state, action);
    case types.ALTERNATIVE_PLAN_ADD: return alternativePlanAdd(state, action);
    case types.ALTERNATIVE_PLAN_ADD_SUCCESS: return alternativePlanAddSuccess(state, action);
    case types.ALTERNATIVE_PLAN_ADD_ERROR: return alternativePlanAddError(state, action);
    case types.SET_STATE_ALTERNATIVE_PLANS: return setStateAlternativePlans(state, action);
    case types.SAVE_CURRENT_PLAN: return saveCurrentPlan(state, action);
    case types.PLANS_GET: return plansGet(state, action);
    case types.PLAN_SELECT: return loadingAfterSelect(state, action);
    case types.PLANS_GET_SUCCESS: return plansGetSuccess(state, action);
    case types.PLANS_GET_ERROR: return plansGetError(state, action);
    case types.SET_PLANS_FILTER: return setAlternativesFilters(state, action);
    case types.CLEAR_PLANS_FILTER: return clearAlternativesFilters(state, action);
    case types.ADD_OPTION_NEW_PRODUCTS_SUCCESS: return setDataForNewProducts(state, action);
    case types.GET_DEFAULT_VALUES_EDIT_PLAN_LIFE: return getDefaultValuesEditPlanLife(state, action);
    default: return state;
  }
}
