import { fromJS } from 'immutable';
import { RESET_RFP_STATE, REMOVE_PLAN, UPDATE_PLAN, ADD_PLAN, createRFPPlan } from '@benrevo/benrevo-react-rfp';
import { extractFloat } from '@benrevo/benrevo-react-core';
import {
  GET_CURRENT_OPTION,
  GET_CURRENT_OPTION_SUCCESS,
  SAVE_CURRENT_OPTION,
  SAVE_CURRENT_OPTION_SUCCESS,
  PLANS_GET_SUCCESS,
  CHANGE_PLAN_FIELD,
  SAVE_CURRENT_OPTION_ERROR,
  GET_CURRENT_ANCILLARY_OPTION_SUCCESS,
  SAVE_CURRENT_ANCILLARY_OPTION_SUCCESS,
  GET_CURRENT_ANCILLARY_OPTION,
  SAVE_CURRENT_ANCILLARY_OPTION,
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
import VISION from '../Plans/Vision';
const templates = {
  HMO: { ...HMO, rx: [...RXHMO.benefits] },
  PPO: { ...PPO, rx: [...RXPPO.benefits] },
  HSA: { ...HSA, rx: [...RXHSA.benefits] },
  DHMO: { ...DHMO },
  DPPO: { ...DPPO },
  VISION: { ...VISION },
};

export function getCurrentOption(state) {
  return state
    .setIn(['plansLoaded'], false);
}

export function getCurrentOptionSuccess(state, action) {
  return state.merge(action.payload)
    .setIn(['loading'], false)
    .setIn(['plansLoaded'], true)
    .setIn(['common', 'rfpCreated'], true)
    .setIn(['common', 'requestError'], false)
    .setIn(['common', 'pendingSave'], false);
}

export function saveCurrentOptionError(state, action) {
  return state.merge(action.payload)
    .setIn(['loading'], false)
    .setIn(['common', 'requestError'], true)
    .setIn(['common', 'pendingSave'], false);
}

export function saveCurrentOption(state) {
  return state
    .setIn(['loading'], true);
}

export function plansGetSuccess(state, action) {
  const plans = action.payload.clientPlans;
  const plansTemplates = [];
  const basePlans = action.payload.plans;
  const setCurrent = (plan, newPlan, rx, index) => {
    const finalPlan = newPlan;
    const getBenefit = (item) => {
      for (let j = 0; j < finalPlan.benefits.length; j += 1) {
        if (finalPlan.benefits[j] && item && finalPlan.benefits[j].sysName === item.sysName) {
          return finalPlan.benefits[j];
        }
      }

      return null;
    };
    if (basePlans[index] && finalPlan.benefits) {
      const baseBenefits = basePlans[index].benefits;
      // finalPlan.benefits = basePlans.get(id).get('benefits');

      for (let i = 0; i < finalPlan.benefits.length; i += 1) {
        const item = baseBenefits[i];
        const benefit = getBenefit(item);

        if (!benefit || finalPlan.benefits[i].temp) {
          baseBenefits.splice(i, 0, finalPlan.benefits[i]);

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
            baseBenefits[i].value = ipDatMaxValue || '';
          }
        } else {
          if (benefit.placeholder) baseBenefits[i].placeholder = benefit.placeholder || undefined;
          if (benefit.placeholderIn) baseBenefits[i].placeholderIn = benefit.placeholderIn || undefined;
          if (benefit.placeholderOut) baseBenefits[i].placeholderOut = benefit.placeholderOut || undefined;
          if (benefit.options) baseBenefits[i].options = benefit.options || undefined;
          if (benefit.hidden) baseBenefits[i].hidden = benefit.hidden || undefined;

          if (baseBenefits[i].type === 'DOLLAR') {
            baseBenefits[i].value = `$${baseBenefits[i].value}`;
          }
          if (baseBenefits[i].type === 'PERCENT') {
            baseBenefits[i].value = `${baseBenefits[i].value}%`;
          }
          if (baseBenefits[i].type === 'MULTIPLE') {
            baseBenefits[i].value = `${baseBenefits[i].value}x`;
          }

          if (baseBenefits[i].typeIn === 'DOLLAR') {
            baseBenefits[i].valueIn = `$${baseBenefits[i].valueIn}`;
          }
          if (baseBenefits[i].typeIn === 'PERCENT') {
            baseBenefits[i].valueIn = `${baseBenefits[i].valueIn}%`;
          }
          if (baseBenefits[i].typeIn === 'MULTIPLE') {
            baseBenefits[i].valueIn = `${baseBenefits[i].valueIn}x`;
          }

          if (baseBenefits[i].typeOut === 'DOLLAR') {
            baseBenefits[i].valueOut = `$${baseBenefits[i].valueOut}`;
          }
          if (baseBenefits[i].typeOut === 'PERCENT') {
            baseBenefits[i].valueOut = `${baseBenefits[i].valueOut}%`;
          }
          if (baseBenefits[i].typeIn === 'MULTIPLE') {
            baseBenefits[i].valueOut = `${baseBenefits[i].valueOut}x`;
          }
        }
      }
      finalPlan.benefits = baseBenefits;
      // finalPlan.romote = true;
      const copyRxValue = (rxArray, rxArrayValues) => {
        rxArray.map((rxItem, i) => {
          let item = rxItem;
          if (rxArrayValues[i].type === 'DOLLAR') {
            item = item.set('value', `$${rxArrayValues[i].value}`);
          } else if (rxArrayValues[i].type === 'PERCENT') {
            item = item.set('value', `${rxArrayValues[i].value}%`);
          } else if (rxArrayValues[i].value) {
            item = item.set('value', rxArrayValues[i].value || undefined);
          }
          //  rxItem.valueIn = rxArrayValues[i].valueIn || undefined; // eslint-disable-line no-param-reassign
          // rxItem.valueOut = rxArrayValues[i].valueOut || undefined; // eslint-disable-line no-param-reassign
          finalPlan.rx = finalPlan.rx.set(i, item);
          return true;
        });
      };
      if (rx && basePlans[index].extRx) {
        copyRxValue(finalPlan.rx, basePlans[index].extRx.rx); // finalPlan.rx = basePlans[index].extRx.rx;
        finalPlan.rx = finalPlan.rx.toJS();
      } else if (rx && basePlans[index].rx && basePlans[index].rx.length) {
        copyRxValue(finalPlan.rx, basePlans[index].rx); // finalPlan.rx = basePlans[index].rx;
        finalPlan.rx = finalPlan.rx.toJS();
      }
    }
  };

  plans.forEach((plan, index) => {
    let newPlan = null;
    switch (plan.title) {
      case 'HMO': {
        newPlan = { ...HMO };
        newPlan.rfpQuoteNetworkPlanId = plan.id || null;
        newPlan.planName = plan.name;
        newPlan.rx = fromJS(RXHMO.benefits);
        newPlan.isKaiser = plan.isKaiser || false;
        break;
      }
      case 'HSA':
        newPlan = { ...HSA };
        newPlan.rfpQuoteNetworkPlanId = plan.id || null;
        newPlan.planName = plan.name;
        newPlan.rx = fromJS(RXHSA.benefits);
        newPlan.isKaiser = plan.isKaiser;
        break;
      case 'PPO':
        newPlan = { ...PPO };
        newPlan.rfpQuoteNetworkPlanId = plan.id || null;
        newPlan.planName = plan.name;
        newPlan.rx = fromJS(RXPPO.benefits);
        newPlan.isKaiser = plan.isKaiser;
        break;
      case 'DPPO':
        newPlan = { ...DPPO };
        newPlan.rfpQuoteNetworkPlanId = plan.id || null;
        newPlan.planName = plan.name;
        break;
      case 'DHMO':
        newPlan = { ...DHMO };
        newPlan.rfpQuoteNetworkPlanId = plan.id || null;
        newPlan.planName = plan.name;
        break;
      case 'VISION':
        newPlan = { ...VISION };
        newPlan.rfpQuoteNetworkPlanId = plan.id || null;
        newPlan.planName = plan.name;
        break;
      default:
        break;
    }
    setCurrent(plan, newPlan, newPlan.rx && newPlan.rx.size, index);
    plansTemplates.push(newPlan);
  });

  return state
    .setIn([action.meta.section, 'benefits'], fromJS(plansTemplates));
}

export function changePlanField(state, action) {
  const data = action.payload;
  let finalState = state;
  if (!finalState.getIn([action.meta.section, 'benefits', data.index])) finalState = finalState.setIn([action.meta.section, 'benefits', data.index], fromJS(templates[data.planType]));

  if (data.type === 'planName') {
    return finalState
      .setIn([action.meta.section, 'benefits', data.index, data.type], data.value);
  }

  return finalState
    .setIn([action.meta.section, 'benefits', data.index, data.type, data.key, data.valueKey], data.value);
}

export function addPlan(state, action) {
  const finalState = state;
  const { section } = action.meta;
  const item = createRFPPlan(finalState, section);
  const optionCount = finalState.get(section).get('optionCount') + 1;
  const max = finalState.get(section).get('maxOptions');
  if (max >= optionCount) {
    return finalState
      .setIn([section, 'benefits'], state.get(section).get('benefits').push(fromJS(templates[item.get('title')])));
  }
  return finalState;
}

export function updatePlan(state, action) {
  const finalState = state;
  const data = action.payload;
  if (data.key === 'title') {
    return finalState
      .setIn([action.meta.section, 'benefits', data.index], fromJS(templates[data.value]));
  } if (data.key === 'name' && finalState.getIn([action.meta.section, 'benefits', data.index])) {
    return finalState
      .setIn([action.meta.section, 'benefits', data.index, 'planName'], data.value);
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

export function resetRfpState() {
  return RfpReducerState;
}

export function reducer(state = [], action) {
  switch (action.type) {
    case GET_CURRENT_OPTION: return getCurrentOption(state, action);
    case GET_CURRENT_ANCILLARY_OPTION: return getCurrentOption(state, action);
    case GET_CURRENT_OPTION_SUCCESS: return getCurrentOptionSuccess(state, action);
    case SAVE_CURRENT_OPTION_SUCCESS: return getCurrentOptionSuccess(state, action);
    case GET_CURRENT_ANCILLARY_OPTION_SUCCESS: return getCurrentOptionSuccess(state, action);
    case SAVE_CURRENT_ANCILLARY_OPTION_SUCCESS: return getCurrentOptionSuccess(state, action);
    case SAVE_CURRENT_OPTION_ERROR: return saveCurrentOptionError(state, action);
    case SAVE_CURRENT_OPTION: return saveCurrentOption(state, action);
    case SAVE_CURRENT_ANCILLARY_OPTION: return saveCurrentOption(state, action);
    case PLANS_GET_SUCCESS: return plansGetSuccess(state, action);
    case CHANGE_PLAN_FIELD: return changePlanField(state, action);
    case ADD_PLAN: return addPlan(state, action);
    case UPDATE_PLAN: return updatePlan(state, action);
    case REMOVE_PLAN: return removePlan(state, action);
    case RESET_RFP_STATE: return resetRfpState(state, action);
    default: return state;
  }
}
