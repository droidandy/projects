import { fromJS, Map } from 'immutable';
import { QUOTED_NORMAL } from '@benrevo/benrevo-react-clients';
import { initialState } from './state';
import * as types from '../constants';

export function setClient(state, action) {
  return state
    .setIn(['medical', 'loading'], true)
    .setIn(['dental', 'loading'], true)
    .setIn(['vision', 'loading'], true)
    .setIn(['final', 'showSubmitSuccess'], false)
    .setIn(['quote', 'client'], fromJS(action.payload))
    .setIn(['quote', 'readonly'], action.payload.clientState !== QUOTED_NORMAL);
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
    .setIn(['life', 'load'], initialState.load)
    .setIn(['vol_life', 'load'], initialState.load)
    .setIn(['std', 'load'], initialState.load)
    .setIn(['vol_std', 'load'], initialState.load)
    .setIn(['ltd', 'load'], initialState.load)
    .setIn(['vol_ltd', 'load'], initialState.load)
    .setIn(['final', 'load'], final)
    .setIn(['enrollment', 'load'], enrollment);
}

export function quotesStatusGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'quotesStatus'], fromJS(action.payload));
}

export function getQuotesCategorySuccess(state, action) {
  return state
    .setIn([action.meta.section, 'quotes'], fromJS(action.payload));
}

export function changeCurrentPage(state, action) {
  return state
    .setIn([action.meta.section, 'page'], fromJS(action.page));
}

export function setCurrentNetworkName(state, action) {
  return state
    .setIn([action.meta.section, 'page', 'options', 'currentNetworkName'], action.payload.networkName);
}

export function resetCurrentPage(state) {
  return state
    .setIn(['medical', 'page'], initialState.page)
    .setIn(['dental', 'page'], initialState.page)
    .setIn(['vision', 'page'], initialState.page)
    .setIn(['final', 'submittedDate'], null)
    .setIn(['medical', 'checkedOptions'], fromJS([]))
    .setIn(['dental', 'checkedOptions'], fromJS([]))
    .setIn(['vision', 'checkedOptions'], fromJS([]));
}

export function submitFinalSections(state) {
  return state
    .setIn(['final', 'showErr'], false)
    .setIn(['final', 'loading'], true);
}

export function submitFinalSectionsSuccess(state, action) {
  if (action.payload.errorMessage) {
    return state
      .setIn(['final', 'loading'], false);
  }

  return state
    .setIn(['final', 'showSubmitSuccess'], true)
    .setIn(['quote', 'readonly'], true)
    .setIn(['final', 'loading'], false);
}

export function selectedGet(state) {
  return state
    .setIn(['final', 'externalProducts', types.LIFE], false)
    .setIn(['final', 'externalProducts', types.STD], false)
    .setIn(['final', 'externalProducts', types.LTD], false)
    .setIn(['final', 'loading'], true)
    .setIn(['final', 'showErr'], false);
}

export function selectedGetSuccess(state, action) {
  const sections = [types.PLAN_TYPE_MEDICAL, types.PLAN_TYPE_DENTAL, types.PLAN_TYPE_VISION];
  const final = action.payload;
  let externalProducts = state.get('final').get('externalProducts');
  let extendedBundleDiscount = state.get('final').get('extendedBundleDiscount');
  let finalState = state;

  extendedBundleDiscount = extendedBundleDiscount.set(types.LIFE, null);
  extendedBundleDiscount = extendedBundleDiscount.set(types.STD, null);
  extendedBundleDiscount = extendedBundleDiscount.set(types.LTD, null);
  extendedBundleDiscount = extendedBundleDiscount.set(types.SUPP_LIFE, null);
  extendedBundleDiscount = extendedBundleDiscount.set(types.STD_LTD, null);
  extendedBundleDiscount = extendedBundleDiscount.set(types.HEALTH, null);

  sections.map((item) => {
    let sectionState = finalState.get(item);
    const plans = final[`${item}Plans`];
    sectionState = sectionState
      .set('selectedPlans', plans)
      .set('totalPlans', final[`${item}Total`]);

    finalState = finalState.set(item, sectionState);

    return true;
  });

  if (action.payload.externalProducts) {
    for (let i = 0; i < action.payload.externalProducts.length; i += 1) {
      const item = action.payload.externalProducts[i];

      externalProducts = externalProducts.set(item.name, true);
      extendedBundleDiscount = extendedBundleDiscount.set(item.name, Map(item));
    }
  }

  finalState = finalState
    .setIn(['final', 'loading'], false)
    .setIn(['final', 'submittedDate'], action.payload.submittedDate)
    .setIn(['final', 'externalProducts'], externalProducts)
    .setIn(['final', 'extendedBundleDiscount'], extendedBundleDiscount)
    .setIn([types.PLAN_TYPE_VISION, 'selected'], action.payload.visionQuoteOptionId)
    .setIn([types.PLAN_TYPE_MEDICAL, 'selected'], action.payload.medicalQuoteOptionId)
    .setIn([types.PLAN_TYPE_DENTAL, 'selected'], action.payload.dentalQuoteOptionId)
    .setIn([types.PLAN_TYPE_VISION, 'selectedOptionName'], action.payload.visionQuoteOptionName)
    .setIn([types.PLAN_TYPE_MEDICAL, 'selectedOptionName'], action.payload.medicalQuoteOptionName)
    .setIn([types.PLAN_TYPE_DENTAL, 'selectedOptionName'], action.payload.dentalQuoteOptionName)
    .setIn(['final', 'totalAll'], final.total)
    .setIn(['final', 'dentalBundleDiscount'], final.dentalBundleDiscount)
    .setIn(['final', 'dentalBundleDiscountPercent'], final.dentalBundleDiscountPercent)
    .setIn(['final', 'dentalBundleDiscountApplied'], final.dentalBundleDiscountApplied)
    .setIn(['final', 'visionBundleDiscount'], final.visionBundleDiscount)
    .setIn(['final', 'visionBundleDiscountPercent'], final.visionBundleDiscountPercent)
    .setIn(['final', 'visionBundleDiscountApplied'], final.visionBundleDiscountApplied)
    .setIn(['final', 'dentalRenewalDiscountPenalty'], final.dentalRenewalDiscountPenalty)
    .setIn(['final', 'visionRenewalDiscountPenalty'], final.visionRenewalDiscountPenalty)
    .setIn(['final', 'medicalWithoutKaiserTotal'], final.medicalWithoutKaiserTotal)
    .setIn(['final', 'subTotalAnnualCost'], final.subTotalAnnualCost)
    .setIn(['final', 'summaryBundleDiscount'], final.summaryBundleDiscount);

  return finalState;
}

export function selectedGetError(state) {
  return state
    .setIn(['final', 'showSubmitSuccess'], false)
    .setIn(['final', 'showErr'], true)
    .setIn(['final', 'loading'], false);
}

export function externalProductsSelect(state, action) {
  return state
    .setIn(['final', 'externalProducts', action.payload.type], action.payload.value);
}

export function quotesGet(state, action) {
  return state
    .setIn([action.meta.section, 'quoteProducts'], {})
    .setIn(['quote', 'loading'], true)
    .setIn(['quote', 'err'], false);
}

export function quotesGetSuccess(state, action) {
  const data = action.payload.data;
  data.life = action.payload.life;
  return state
    .setIn([action.meta.section, 'quoteProducts'], data)
    .setIn(['quote', 'loading'], false)
    .setIn(['quote', 'err'], false);
}

export function quotesGetError(state) {
  return state
    .setIn(['quote', 'loading'], false)
    .setIn(['quote', 'err'], true);
}

export function resetLoader(state) {
  return state
    .setIn(['quote', 'loading'], false);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.SET_CLIENT: return setClient(state, action);
    case types.CHANGE_LOAD: return changeLoad(state, action);
    case types.CHANGE_LOAD_RESET: return changeLoadReset(state, action);
    case types.QUOTES_STATUS_GET_SUCCESS: return quotesStatusGetSuccess(state, action);
    case types.GET_QUOTES_CATEGORY_SUCCESS: return getQuotesCategorySuccess(state, action);
    case types.CHANGE_CURRENT_PAGE: return changeCurrentPage(state, action);
    case types.SET_CURRENT_NETWORK_NAME: return setCurrentNetworkName(state, action);
    case types.RESET_CURRENT_PAGE: return resetCurrentPage(state, action);
    case types.SUBMIT_FINAL_SECTIONS: return submitFinalSections(state, action);
    case types.SUBMIT_FINAL_SECTIONS_SUCCESS: return submitFinalSectionsSuccess(state, action);
    case types.SELECTED_GET: return selectedGet(state, action);
    case types.SELECTED_GET_SUCCESS: return selectedGetSuccess(state, action);
    case types.SELECTED_GET_ERROR: return selectedGetError(state, action);
    case types.EXTERNAL_PRODUCTS_SELECT: return externalProductsSelect(state, action);
    case types.QUOTES_GET: return quotesGet(state, action);
    case types.QUOTES_GET_SUCCESS: return quotesGetSuccess(state, action);
    case types.QUOTES_GET_ERROR: return quotesGetError(state, action);
    case types.QUOTES_GET_RESET: return resetLoader(state, action);
    default: return state;
  }
}
