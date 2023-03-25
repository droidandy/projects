import { fromJS } from 'immutable';
import { RESET_RFP_STATE, REMOVE_PLAN, UPDATE_PLAN, RFP_PLANS_GET_SUCCESS } from '@benrevo/benrevo-react-rfp';
import { extractFloat } from '@benrevo/benrevo-react-core';
import {
  CHANGE_PLAN_FIELD,
  SELECT_BENEFITS,
  DENTAL_SECTION,
  DOWNLOAD_OPTIMIZER,
  DOWNLOAD_OPTIMIZER_SUCCESS,
  DOWNLOAD_OPTIMIZER_ERROR,
} from '../constants';
import RfpReducerState from './state';
import RXHSA from '../Plans/RXHSA';
import DHMO from '../Plans/DHMO';
import DPPO from '../Plans/DPPO';
import RXHMO from '../Plans/RXHMO';
import HMO from '../Plans/HMO';
import RXPPO from '../Plans/RXPPO';
import HSA from '../Plans/HSA';
import PPO from '../Plans/PPO';
const templates = {
  HMO: { ...HMO, rx: [...RXHMO.benefits] },
  PPO: { ...PPO, rx: [...RXPPO.benefits] },
  HSA: { ...HSA, rx: [...RXHSA.benefits] },
  DHMO: { ...DHMO },
  DPPO: { ...DPPO },
};

export function plansGetSuccess(state, action) {
  const plans = action.payload.clientPlans;
  const plansTemplates = [];
  const basePlans = action.payload.plans;
  const selectedBenefits = {};
  const setCurrent = (plan, newPlan, rx, index) => {
    const finalPlan = newPlan;
    const getBenefit = (item) => {
      for (let j = 0; j < basePlans[index].benefits.length; j += 1) {
        if (basePlans[index].benefits[j] && item && basePlans[index].benefits[j].sysName === item.sysName) {
          return basePlans[index].benefits[j];
        }
      }

      return null;
    };
    if (basePlans[index] && finalPlan.benefits) {
      const baseBenefits = basePlans[index].benefits;
      const newBenefits = [];
      // finalPlan.benefits = basePlans.get(id).get('benefits');

      for (let i = 0; i < finalPlan.benefits.length; i += 1) {
        const benefit = finalPlan.benefits[i];
        const item = getBenefit(benefit);

        newBenefits[i] = item || benefit;
        if (benefit.temp) {
          if (finalPlan.benefits[i].sysName === 'IP_DAY_MAX') {
            let INPATIENT_HOSPITAL = 0;
            let IP_COPAY_MAX = 0;

            for (let m = 0; m < baseBenefits.length; m += 1) {
              if (baseBenefits[m].sysName === 'INPATIENT_HOSPITAL') {
                [INPATIENT_HOSPITAL] = extractFloat(baseBenefits[m].value);
              } else if (baseBenefits[m].sysName === 'IP_COPAY_MAX') {
                [IP_COPAY_MAX] = extractFloat(baseBenefits[m].value);
              }
            }
            const ipDatMaxValue = (INPATIENT_HOSPITAL !== null && IP_COPAY_MAX !== null) ? IP_COPAY_MAX / INPATIENT_HOSPITAL : 0;
            newBenefits[i].value = ipDatMaxValue || '';
          }
        } else if (item) {
          newBenefits[i].placeholder = benefit.placeholder || undefined;
          newBenefits[i].placeholderIn = benefit.placeholderIn || undefined;
          newBenefits[i].placeholderOut = benefit.placeholderOut || undefined;
          newBenefits[i].options = benefit.options || undefined;
          if (benefit.restriction !== undefined) {
            newBenefits[i].optionsRestriction = benefit.optionsRestriction || undefined;
            newBenefits[i].restriction = item.restriction || '';
          }
          newBenefits[i].hidden = benefit.hidden || undefined;
          newBenefits[i].name = benefit.name || undefined;

          if (newBenefits[i].type === 'DOLLAR') {
            newBenefits[i].value = `$${item.value}`;
          }
          if (newBenefits[i].type === 'PERCENT') {
            newBenefits[i].value = `${item.value}%`;
          }
          if (newBenefits[i].type === 'MULTIPLE') {
            newBenefits[i].value = `${item.value}x`;
          }

          if (newBenefits[i].typeIn === 'DOLLAR') {
            newBenefits[i].valueIn = `$${item.valueIn}`;
          }
          if (newBenefits[i].typeIn === 'PERCENT') {
            newBenefits[i].valueIn = `${item.valueIn}%`;
          }
          if (newBenefits[i].typeIn === 'MULTIPLE') {
            newBenefits[i].valueIn = `${item.valueIn}x`;
          }

          if (newBenefits[i].typeOut === 'DOLLAR') {
            newBenefits[i].typeOut = `$${item.typeOut}`;
          }
          if (newBenefits[i].typeOut === 'PERCENT') {
            newBenefits[i].typeOut = `${item.typeOut}%`;
          }
          if (newBenefits[i].typeIn === 'MULTIPLE') {
            newBenefits[i].typeOut = `${item.typeOut}x`;
          }
        }
      }
      finalPlan.benefits = newBenefits;
      finalPlan.romote = true;
      const copyRxValue = (rxArray, rxArrayValues) => {
        rxArray.forEach((rxItem, i) => {
          const item = rxItem;
          if (rxArrayValues[i].type === 'DOLLAR') {
            item.value = `$${rxArrayValues[i].value}`;
          } else if (rxArrayValues[i].type === 'PERCENT') {
            item.value = `${rxArrayValues[i].value}%`;
          } else {
            item.value = rxArrayValues[i].value || undefined; // eslint-disable-line no-param-reassign
          }
          //  rxItem.valueIn = rxArrayValues[i].valueIn || undefined; // eslint-disable-line no-param-reassign
          // rxItem.valueOut = rxArrayValues[i].valueOut || undefined; // eslint-disable-line no-param-reassign
        });
      };
      if (rx && basePlans[index].extRx) {
        copyRxValue(finalPlan.rx, basePlans[index].extRx.rx); // finalPlan.rx = basePlans[index].extRx.rx;
      } else if (rx && basePlans[index].rx && basePlans[index].rx.length) {
        copyRxValue(finalPlan.rx, basePlans[index].rx); // finalPlan.rx = basePlans[index].rx;
      }
    }
  };

  plans.forEach((plan, index) => {
    let newPlan = null;
    switch (plan.title) {
      case 'HMO': {
        newPlan = { ...HMO };
        newPlan.rfpQuoteNetworkPlanId = plan.id;
        newPlan.rx = RXHMO.benefits;
        newPlan.isKaiser = plan.isKaiser;
        break;
      }
      case 'HSA':
        newPlan = { ...HSA };
        newPlan.rfpQuoteNetworkPlanId = plan.id;
        newPlan.rx = RXHSA.benefits;
        newPlan.isKaiser = plan.isKaiser;
        break;
      case 'PPO':
        newPlan = { ...PPO };
        newPlan.rfpQuoteNetworkPlanId = plan.id;
        newPlan.rx = RXPPO.benefits;
        newPlan.isKaiser = plan.isKaiser;
        break;
      case 'DPPO':
        newPlan = { ...DPPO };
        newPlan.rfpQuoteNetworkPlanId = plan.id;
        if (basePlans[index].benefits.length) selectedBenefits[index] = true;
        break;
      case 'DHMO':
        newPlan = { ...DHMO };
        newPlan.rfpQuoteNetworkPlanId = plan.id;
        break;
      default:
        break;
    }
    setCurrent(plan, newPlan, newPlan.rx && newPlan.rx.length, index);
    plansTemplates.push(newPlan);
  });

  if (action.meta.section === DENTAL_SECTION) {
    return state
      .setIn([action.meta.section, 'selectedBenefits'], fromJS(selectedBenefits))
      .setIn([action.meta.section, 'benefits'], fromJS(plansTemplates));
  }

  return state
    .setIn([action.meta.section, 'benefits'], fromJS(plansTemplates));
}

export function changePlanField(state, action) {
  const data = action.payload;
  let finalState = state;
  const selectedBenefits = state.getIn([action.meta.section, 'selectedBenefits']);
  let count = 0;

  if (selectedBenefits) {
    selectedBenefits.map((item) => {
      if (item) count += 1;

      return count;
    });
    if (count < 2) {
      finalState = finalState.setIn([action.meta.section, 'selectedBenefits', data.index], true);
    }
  }

  if (!finalState.getIn([action.meta.section, 'benefits', data.index])) finalState = finalState.setIn([action.meta.section, 'benefits', data.index], fromJS(templates[data.planType]));

  return finalState
    .setIn([action.meta.section, 'benefits', data.index, data.type, data.key, data.valueKey], data.value);
}

export function updatePlan(state, action) {
  const finalState = state;
  const data = action.payload;
  if (data.key === 'title') {
    return finalState
      .setIn([action.meta.section, 'benefits', data.index], fromJS(templates[data.value]));
  }
  return finalState;
}

export function removePlan(state, action) {
  const finalState = state;
  const count = finalState.get(action.meta.section).get('benefits').size;

  if (count > 1) {
    return finalState
      .setIn([action.meta.section, 'benefits'], finalState.get(action.meta.section).get('benefits').pop());
  }

  return finalState;
}

export function selectBenefits(state, action) {
  const selectedBenefits = state.getIn([action.meta.section, 'selectedBenefits']);
  let count = 0;

  selectedBenefits.map((item) => {
    if (item) count += 1;

    return count;
  });


  if (count < 2 || !action.payload.select) {
    return state
      .setIn([action.meta.section, 'selectedBenefits', action.payload.planIndex], action.payload.select);
  }

  return state
    .setIn([action.meta.section, 'selectedBenefits', action.payload.planIndex], false);
}

export function downloadOptimizer(state) {
  return state
    .setIn(['loadingOptimizer'], true);
}

export function downloadOptimizerSuccess(state) {
  return state
    .setIn(['loadingOptimizer'], false);
}

export function downloadOptimizerError(state) {
  return state
    .setIn(['loadingOptimizer'], false);
}

export function resetRfpState() {
  return RfpReducerState;
}

export function reducer(state = [], action) {
  switch (action.type) {
    case RFP_PLANS_GET_SUCCESS: return plansGetSuccess(state, action);
    case CHANGE_PLAN_FIELD: return changePlanField(state, action);
    case SELECT_BENEFITS: return selectBenefits(state, action);
    case UPDATE_PLAN: return updatePlan(state, action);
    case REMOVE_PLAN: return removePlan(state, action);
    case DOWNLOAD_OPTIMIZER: return downloadOptimizer(state, action);
    case DOWNLOAD_OPTIMIZER_SUCCESS: return downloadOptimizerSuccess(state, action);
    case DOWNLOAD_OPTIMIZER_ERROR: return downloadOptimizerError(state, action);
    case RESET_RFP_STATE: return resetRfpState(state, action);
    default: return state;
  }
}
