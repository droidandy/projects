import { fromJS, Map } from 'immutable';
import moment from 'moment';
import { browserHistory } from 'react-router';
import reducer from '../reducer';
import configureStore from '../../../store';
// import * as actions from '../actions';
import * as types from '../constants';
import { selectedCarrier } from '../../../config';
import HMO from '../components/HMO';
import ANTHEM_HMO from '../components/ANTHEM_HMO';
import PPO from '../components/PPO';
import RXHMO from '../components/RXHMO';
import RXHSA from '../components/RXHSA';
import RXPPO from '../components/RXPPO';
import HSA from '../components/HSA';
import DHMO from '../components/DHMO';
import DPPO from '../components/DPPO';
import VISION from '../components/Vision';

describe('adminPageReducer', () => {
  let store;
  let state;
  const formatDate = 'MM.DD.YYYY';

  beforeEach(() => {
    store = configureStore({}, browserHistory);
    state = store.getState().get('plans');
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });

  it('FILES_GET', () => {
    const mockAction = { meta: {}, type: types.FILES_GET, payload: {} };
    const mockState = state
      .setIn(['loadingFiles'], fromJS({}))
      .setIn(['files'], fromJS([]))
      .setIn(['loadingFilesPage'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FILES_GET_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.FILES_GET_SUCCESS, payload: {} };
    const mockState = state
      .setIn(['loadingFilesPage'], false)
      .setIn(['files'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FILES_GET_ERROR', () => {
    const mockAction = { meta: {}, type: types.FILES_GET_ERROR, payload: {} };
    const mockState = state
      .setIn(['loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GIVE_ACCESS_TO_CLIENT', () => {
    const mockAction = { meta: {}, type: types.GIVE_ACCESS_TO_CLIENT, payload: {} };
    const mockState = state
      .setIn(['loadingbrClientsPage'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GIVE_ACCESS_TO_CLIENT_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.GIVE_ACCESS_TO_CLIENT_SUCCESS, payload: {} };
    const mockState = state
      .setIn(['loadingbrClientsPage'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GIVE_ACCESS_TO_CLIENT_ERROR', () => {
    const mockAction = { meta: {}, type: types.GIVE_ACCESS_TO_CLIENT_ERROR, payload: {} };
    const mockState = state
      .setIn(['loadingbrClientsPage'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DOWNLOAD_FILE', () => {
    const mockAction = { meta: {}, type: types.DOWNLOAD_FILE, payload: { link: '' } };
    const mockState = state
      .setIn(['loadingFiles', mockAction.payload.link], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DOWNLOAD_FILE_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.DOWNLOAD_FILE_SUCCESS, payload: { link: {} } };
    const mockState = state
      .deleteIn(['loadingFiles', mockAction.payload.link]);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DOWNLOAD_FILE_ERROR', () => {
    const mockAction = { meta: {}, type: types.DOWNLOAD_FILE_ERROR, payload: { link: {} } };
    const mockState = state
      .deleteIn(['loadingFiles', mockAction.payload.link]);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_QUOTE_TYPE', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.CHANGE_QUOTE_TYPE, payload: {}, value: false };
    const mockState = state
      .setIn([mockAction.meta.section, 'quoteIsEasy'], mockAction.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPLOAD_QUOTE', () => {
    const baseState = state
      .setIn(['loadingQuotes', 'medical'], true);
    const mockAction = { meta: { section: 'medical' }, type: types.UPLOAD_QUOTE, payload: { category: 'medical' }, value: false };
    const category = (mockAction.payload.kaiser) ? 'kaiser' : mockAction.payload.category;
    const mockState = state
      .setIn(['loadingQuotes', category], true);
    expect(reducer(baseState, mockAction)).toEqual(mockState);
  });

  it('PREVIEW_QUOTE_SUCCESS', () => {
    const mockAction = { meta: { section: 'dental' }, type: types.PREVIEW_QUOTE_SUCCESS, payload: { infoData: { kaiser: null, category: 'medical' }, data: {} } };
    const info = mockAction.payload.infoData;
    const category = (info.kaiser) ? 'kaiser' : info.category;
    const mockState = state
      .setIn(['loadingQuotes', category], true)
      .setIn([category, 'quotePreview'], fromJS(mockAction.payload.data));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPLOAD_QUOTE_SUCCESS', () => {
    const baseState = state
      .setIn(['quoteDates', 'medical'], moment(new Date()).format(formatDate));
    const mockAction = { meta: { section: 'medical' }, type: types.UPLOAD_QUOTE_SUCCESS, payload: { info: { category: 'medical', kaiser: false }, data: { fileName: 'test' } }, value: false };
    const categoryName = (mockAction.payload.info.kaiser) ? 'kaiser' : mockAction.payload.info.category;
    const mockState = state
      .setIn(['quoteDates', categoryName], moment(new Date()).format(formatDate))
      .setIn([categoryName, 'option1'], fromJS({}))
      .setIn([categoryName, 'quoteFileName'], mockAction.payload.data.fileName)
      .deleteIn(['loadingQuotes', categoryName]);
    expect(reducer(baseState, mockAction)).toEqual(mockState);
  });

  it('DOWNLOAD_FILE', () => {
    const mockAction = { meta: {}, type: types.DOWNLOAD_FILE, payload: { link: 'file1' } };
    const mockState = state
      .setIn(['loadingFiles', mockAction.payload.link], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PREVIEW_QUOTE_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.PREVIEW_QUOTE_SUCCESS, payload: { infoData: { category: 'medical' } } };
    const info = mockAction.payload.infoData;
    const category = (info.kaiser) ? 'kaiser' : info.category;
    const mockState = state
      .setIn(['loadingQuotes', category], true)
      .setIn([category, 'quotePreview'], fromJS(mockAction.payload.data));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPLOAD_QUOTE_ERROR', () => {
    const mockAction = { meta: {}, type: types.UPLOAD_QUOTE_ERROR, payload: { category: 'medical', fileType: '' } };
    let category = (mockAction.payload.kaiser) ? 'kaiser' : mockAction.payload.category;
    if (mockAction.payload.fileType) {
      category += mockAction.payload.fileType;
    }
    const mockState = state
      .deleteIn(['loadingQuotes', category]);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PREVIEW_QUOTE_ERROR', () => {
    const mockAction = { meta: {}, type: types.PREVIEW_QUOTE_ERROR, payload: { category: 'medical', fileType: '' } };
    let category = (mockAction.payload.kaiser) ? 'kaiser' : mockAction.payload.category;
    if (mockAction.payload.fileType) {
      category += mockAction.payload.fileType;
    }
    const mockState = state
      .deleteIn(['loadingQuotes', category]);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('HISTORY_GET_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.HISTORY_GET_SUCCESS, payload: { } };
    const mockState = state
      .set('history', fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CARRIER_HISTORY', () => {
    const mockAction = { meta: {}, type: types.GET_CARRIER_HISTORY, payload: { } };
    const mockState = state
      .setIn(['medical', 'carrierHistory'], fromJS([]))
      .setIn(['dental', 'carrierHistory'], fromJS([]))
      .setIn(['vision', 'carrierHistory'], fromJS([]))
      .setIn(['medical', 'networks'], fromJS({}))
      .setIn(['dental', 'networks'], fromJS({}))
      .setIn(['vision', 'networks'], fromJS({}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CARRIER_HISTORY_GET_SUCCESS', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.CARRIER_HISTORY_GET_SUCCESS, payload: {} };
    const mockState = state
      .setIn(['medical', 'carrierHistory'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CARRIER_HISTORY_GET_ERROR', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.CARRIER_HISTORY_GET_ERROR, payload: {} };
    const mockState = state;
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PLAN_FIELD_UPDATE', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.PLAN_FIELD_UPDATE, payload: { valType: 'sysName', index1: 0, value: '', rxFlag: false, index2: 0 } };
    let mockState = state;
    if (mockAction.payload.valType === 'name') {
      const plans = state.get(mockAction.meta.section).toJS().plans;
      plans[mockAction.payload.index1].planName = mockAction.payload.value;
      mockState = state
        .setIn([mockAction.meta.section, 'planChanged'], true)
        .setIn([mockAction.meta.section, 'plans'], fromJS(plans));
    }
    if (mockAction.payload.rxFlag) {
      const plans = state.get(mockAction.meta.section).toJS().plans;
      plans[mockAction.payload.index1].rx[mockAction.payload.index2][mockAction.payload.valType] = mockAction.payload.value;
      mockState = state
        .setIn([mockAction.meta.section, 'planChanged'], true)
        .setIn([mockAction.meta.section, 'plans'], fromJS(plans));
    }
    const plans = state.get(mockAction.meta.section).toJS().plans;
    if (plans && plans.length && plans[mockAction.payload.index1] && plans[mockAction.payload.index1].benefits) {
      plans[mockAction.payload.index1].benefits[mockAction.payload.index2][mockAction.payload.valType] = mockAction.payload.value;
    }
    mockState = state
      .setIn([mockAction.meta.section, 'planChanged'], true)
      .setIn([mockAction.meta.section, 'plans'], fromJS(plans));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_CURRENT_CARRIER', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.CHANGE_CURRENT_CARRIER, payload: { carrierId: 1, index: 0 } };
    let selected = {};
    const carriers = state.get(mockAction.meta.section).toJS().carrierHistory;
    carriers.forEach((item) => {
      if (item.carrierId === mockAction.payload.carrierId) {
        selected = item;
        return true;
      }
      return true;
    });
    const plans = state.get(mockAction.meta.section).toJS().plans;
    if (plans && plans.length && plans[mockAction.payload.index]) {
      plans[mockAction.payload.index].selectedCarrier = selected;
    }
    const mockState = state
      .setIn([mockAction.meta.section, 'plans'], fromJS(plans));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_CURRENT_NETWORK', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.CHANGE_CURRENT_NETWORK, payload: { carrierId: 1, index: 0 } };
    let selected = {};
    const networkType = `${mockAction.payload.planType}_${mockAction.payload.carrierId}`;
    const networks = state.get(mockAction.meta.section).toJS().networks[networkType];
    if (networks && networks.length) {
      networks.forEach((item) => {
        if (item.networkId === mockAction.payload.networkId) {
          selected = item;
          return true;
        }
        return true;
      });
    }
    const plans = state.get(mockAction.meta.section).toJS().plans;
    if (plans && plans.length && plans[mockAction.payload.index]) {
      plans[mockAction.payload.index].selectedNetwork = selected;
    }
    const mockState = state
      .setIn([mockAction.meta.section, 'plans'], fromJS(plans));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENT_PLANS_GET', () => {
    const mockAction = { meta: {}, type: types.CLIENT_PLANS_GET, payload: { } };
    const mockState = state
      .setIn(['loadingPlans'], true)
      .setIn(['loadingContributions'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENT_PLANS_GET_ERROR', () => {
    const mockAction = { meta: {}, type: types.CLIENT_PLANS_GET_ERROR, payload: { } };
    const mockState = state
      .setIn(['loadingPlans'], false)
      .setIn(['loadingContributions'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PLAN_GET_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.PLAN_GET_SUCCESS, payload: { clientPlans: [], plans: [] } };

    const plans = mockAction.payload.clientPlans;
    const plansTemplates = {
      medical: [],
      dental: [],
      vision: [],
    };
    const optionIds = {};
    const basePlans = mockAction.payload.plans;
    const setCurrent = (plan, newPlan, rx) => {
      const finalPlan = newPlan;
      const getBenefit = (item) => {
        for (let j = 0; j < finalPlan.benefits.length; j += 1) {
          if (finalPlan.benefits[j] && item && finalPlan.benefits[j].sysName === item.sysName) {
            return finalPlan.benefits[j];
          }
        }

        return null;
      };
      const id = plan.client_plan_id.toString();
      if (basePlans[id] && finalPlan.benefits) {
        const baseBenefits = basePlans[id].benefits;
        // finalPlan.benefits = basePlans.get(id).get('benefits');

        for (let i = 0; i < finalPlan.benefits.length; i += 1) {
          const item = baseBenefits[i];
          const benefit = getBenefit(item);

          if (!benefit) {
            baseBenefits.splice(i, 0, finalPlan.benefits[i]);
          } else {
            baseBenefits[i].placeholder = benefit.placeholder || undefined;
            baseBenefits[i].placeholderIn = benefit.placeholderIn || undefined;
            baseBenefits[i].placeholderOut = benefit.placeholderOut || undefined;
            baseBenefits[i].options = benefit.options || undefined;

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
              baseBenefits[i].typeOut = `$${baseBenefits[i].typeOut}`;
            }
            if (baseBenefits[i].typeOut === 'PERCENT') {
              baseBenefits[i].typeOut = `${baseBenefits[i].typeOut}%`;
            }
            if (baseBenefits[i].typeIn === 'MULTIPLE') {
              baseBenefits[i].typeOut = `${baseBenefits[i].typeOut}x`;
            }
          }
        }
        finalPlan.benefits = baseBenefits;
        finalPlan.romote = true;
        const copyRxValue = (rxArray, rxArrayValues) => {
          rxArray.forEach((rxItem, index) => {
            const item = rxItem;
            if (rxArrayValues[index].type === 'DOLLAR') {
              item.value = `$${rxArrayValues[index].value}`;
            } else if (rxArrayValues[index].type === 'PERCENT') {
              item.value = `${rxArrayValues[index].value}%`;
            } else {
              item.value = rxArrayValues[index].value || undefined; // eslint-disable-line no-param-reassign
            }
            //  rxItem.valueIn = rxArrayValues[index].valueIn || undefined; // eslint-disable-line no-param-reassign
            // rxItem.valueOut = rxArrayValues[index].valueOut || undefined; // eslint-disable-line no-param-reassign
          });
        };
        if (rx && basePlans[id].extRx) {
          copyRxValue(finalPlan.rx, basePlans[id].extRx.rx); // finalPlan.rx = basePlans[id].extRx.rx;
        } else if (rx && basePlans[id].rx && basePlans[id].rx.length) {
          copyRxValue(finalPlan.rx, basePlans[id].rx); // finalPlan.rx = basePlans[id].rx;
        }
        finalPlan.planName = basePlans[id].nameByNetwork;
        finalPlan.selectedCarrier.carrierId = basePlans[id].carrierId;
        // finalPlan.selectedCarrier.name = basePlans.get(id).get('carrierName');
        finalPlan.selectedCarrier.displayName = basePlans[id].carrierDisplayName;
        finalPlan.selectedNetwork.networkId = basePlans[id].rfpQuoteNetworkId;
        finalPlan.selectedNetwork.name = basePlans[id].nameByNetwork;
      }
    };
    plans.forEach((plan) => {
      let newPlan = null;
      if (!optionIds[plan.option_id || plan.client_plan_id]) {
        optionIds[plan.option_id || plan.client_plan_id] = true;
        switch (plan.planType) {
          case 'HMO': {
            newPlan = selectedCarrier.value === 'ANTHEM_BLUE_CROSS' ? { ...ANTHEM_HMO } : { ...HMO };
            newPlan.selectedCarrier = {};
            newPlan.selectedNetwork = {};
            newPlan.rfpQuoteNetworkPlanId = plan.client_plan_id;
            newPlan.optionId = plan.option_id;
            newPlan.rx = RXHMO.benefits;
            newPlan.isKaiser = plan.isKaiser;
            plansTemplates.medical.push(newPlan);
            setCurrent(plan, newPlan, true);
            break;
          }
          case 'HSA':
            newPlan = { ...HSA };
            newPlan.selectedCarrier = {};
            newPlan.selectedNetwork = {};
            newPlan.rfpQuoteNetworkPlanId = plan.client_plan_id;
            newPlan.optionId = plan.option_id;
            newPlan.rx = RXHSA.benefits;
            newPlan.isKaiser = plan.isKaiser;
            plansTemplates.medical.push(newPlan);
            setCurrent(plan, newPlan, true);
            break;
          case 'PPO':
            newPlan = { ...PPO };
            newPlan.selectedCarrier = {};
            newPlan.selectedNetwork = {};
            newPlan.rfpQuoteNetworkPlanId = plan.client_plan_id;
            newPlan.optionId = plan.option_id;
            newPlan.rx = RXPPO.benefits;
            newPlan.isKaiser = plan.isKaiser;
            plansTemplates.medical.push(newPlan);
            setCurrent(plan, newPlan, true);
            break;
          case 'DPPO':
            newPlan = { ...DPPO };
            newPlan.selectedCarrier = {};
            newPlan.selectedNetwork = {};
            newPlan.rfpQuoteNetworkPlanId = plan.client_plan_id;
            newPlan.optionId = plan.option_id;
            plansTemplates.dental.push(newPlan);
            setCurrent(plan, newPlan, false);
            break;
          case 'DHMO':
            newPlan = { ...DHMO };
            newPlan.selectedCarrier = {};
            newPlan.selectedNetwork = {};
            newPlan.rfpQuoteNetworkPlanId = plan.client_plan_id;
            newPlan.optionId = plan.option_id;
            plansTemplates.dental.push(newPlan);
            setCurrent(plan, newPlan, false);
            break;
          case 'VISION':
            newPlan = { ...VISION };
            newPlan.selectedCarrier = {};
            newPlan.selectedNetwork = {};
            newPlan.rfpQuoteNetworkPlanId = plan.client_plan_id;
            newPlan.optionId = plan.option_id;
            plansTemplates.vision.push(newPlan);
            setCurrent(plan, newPlan, false);
            break;
          default:
            break;
        }
      }
    });

    const mockState = state
      .setIn(['clientPlans'], fromJS(mockAction.payload.clientPlans))
      .setIn(['basePlans'], fromJS(mockAction.payload.plans))
      .setIn(['changedPlans'], fromJS([]))
      .setIn(['loadingPlans'], false)
      .setIn(['medical', 'plansTemplatesDefined'], true)
      .setIn(['dental', 'plansTemplatesDefined'], true)
      .setIn(['vision', 'plansTemplatesDefined'], true)
      // setting plans template
      .setIn(['medical', 'plans'], fromJS(plansTemplates.medical))
      .setIn(['dental', 'plans'], fromJS(plansTemplates.dental))
      .setIn(['vision', 'plans'], fromJS(plansTemplates.vision))
      .setIn(['loadingContributions'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_PLANS_PAGE', () => {
    const mockAction = { meta: {}, type: types.UPDATE_PLANS_PAGE, payload: { } };
    const mockState = state
      .setIn(['medical', 'plans'], fromJS([]))
      .setIn(['dental', 'plans'], fromJS([]))
      .setIn(['vision', 'plans'], fromJS([]))
      .setIn(['medical', 'option1'], fromJS({}))
      .setIn(['kaiser', 'option1'], fromJS({}))
      .setIn(['dental', 'option1'], fromJS({}))
      .setIn(['vision', 'option1'], fromJS({}))
      .setIn(['medical', 'option1Difference'], fromJS([]))
      .setIn(['dental', 'option1Difference'], fromJS([]))
      .setIn(['vision', 'option1Difference'], fromJS([]))
      .setIn(['medical', 'plansTemplatesDefined'], false)
      .setIn(['dental', 'plansTemplatesDefined'], false)
      .setIn(['vision', 'plansTemplatesDefined'], false)
      .setIn(['medical', 'planAddedSuccess'], false)
      .setIn(['dental', 'planAddedSuccess'], false)
      .setIn(['vision', 'planAddedSuccess'], false)
      .setIn(['medical', 'quotesLatest'], null)
      .setIn(['kaiser', 'quotesLatest'], null)
      .setIn(['dental', 'quotesLatest'], null)
      .setIn(['vision', 'quotesLatest'], null)
      .setIn(['medicalRenewal', 'quotesLatest'], null)
      .setIn(['dentalRenewal', 'quotesLatest'], null)
      .setIn(['visionRenewal', 'quotesLatest'], null);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PLAN_GET_ERROR', () => {
    const mockAction = { meta: {}, type: types.PLAN_GET_ERROR, payload: { } };
    const mockState = state
      .setIn(['loadingPlans'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PLAN_CREATE', () => {
    const mockAction = { meta: {}, type: types.PLAN_CREATE, payload: { } };
    const mockState = state
      .setIn([mockAction.meta.section, 'loading'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PLAN_CREATE_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.PLAN_CREATE_SUCCESS, payload: { } };
    const mockState = state
      .setIn([mockAction.meta.section, 'planAddedSuccess'], true)
      .setIn([mockAction.meta.section, 'loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PLAN_CREATE_ERROR', () => {
    const mockAction = { meta: {}, type: types.PLAN_CREATE_ERROR, payload: { } };
    const mockState = state
      .setIn([mockAction.meta.section, 'planAddedSuccess'], false)
      .setIn([mockAction.meta.section, 'loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('NETWORKS_GET_SUCCESS', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.NETWORKS_GET_SUCCESS, payload: { planType: 'HMO', carrierId: 1 } };
    const networkType = `${mockAction.payload.planType}_${mockAction.payload.carrierId}`;
    const mockState = state
      .setIn([mockAction.meta.section, 'networks', networkType], fromJS(mockAction.payload.networks))
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('HISTORY_GET_ERROR', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.HISTORY_GET_ERROR, payload: { planType: 'HMO', carrierId: 1 } };
    const mockState = state;
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SUMMARY_GET', () => {
    const mockAction = { meta: {}, type: types.SUMMARY_GET, payload: { } };
    const mockState = state
      .setIn(['summaries'], fromJS({}))
      .setIn(['loadingSummary'], true)
      .setIn(['summaryLoaded'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SUMMARY_GET_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.SUMMARY_GET_SUCCESS, payload: { medicalNotes: [], dentalNotes: [], visionNotes: [], medicalWithKaiserNotes: [], modLetterDate: 1532993679000 } };
    let mockState = state;
    if (!mockAction.payload.medicalNotes && !mockAction.payload.medicalWithKaiserNotes && !mockAction.payload.dentalNotes && !mockAction.payload.visionNotes) {
      mockState = state
        .setIn(['loadingSummary'], false);
    }
    mockState = state
      .setIn(['summaryLoaded'], true)
      .setIn(['loadingSummary'], false)
      .setIn(['summaries', 'medical'], mockAction.payload.medicalNotes)
      .setIn(['summaries', 'kaiser'], mockAction.payload.medicalWithKaiserNotes)
      .setIn(['summaries', 'dental'], mockAction.payload.dentalNotes)
      .setIn(['summaries', 'vision'], mockAction.payload.visionNotes)
      .setIn(['modLetterDate'], 'N/A');
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SUMMARY_GET_ERROR', () => {
    const mockAction = { meta: {}, type: types.SUMMARY_GET_ERROR, payload: { } };
    const mockState = state
      .setIn(['loadingSummary'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SUMMARY_SAVE', () => {
    const mockAction = { meta: {}, type: types.SUMMARY_SAVE, payload: { section: 'medical', value: '' } };
    const mockState = state
      .setIn(['summaries', mockAction.payload.section], mockAction.payload.value)
      .setIn(['savingSummary', mockAction.payload.section], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SUMMARY_SAVE_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.SUMMARY_SAVE_SUCCESS, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['summaryDate'], moment(new Date()).format(formatDate))
      .setIn(['summaryLoaded'], true)
      .setIn(['savingSummary', mockAction.payload.section], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SUMMARY_SAVE_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.SUMMARY_SAVE_SUCCESS, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['summaryDate'], moment(new Date()).format(formatDate))
      .setIn(['summaryLoaded'], true)
      .setIn(['savingSummary', mockAction.payload.section], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SUMMARY_SAVE_ERROR', () => {
    const mockAction = { meta: {}, type: types.SUMMARY_SAVE_ERROR, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['savingSummary'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_NOTIFICATION', () => {
    const mockAction = { meta: {}, type: types.SEND_NOTIFICATION, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['loadingNotification'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_NOTIFICATION_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.SEND_NOTIFICATION_SUCCESS, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['sentDate'], moment(new Date()).format(formatDate))
      .setIn(['loadingNotification'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_NOTIFICATION_ERROR', () => {
    const mockAction = { meta: {}, type: types.SEND_NOTIFICATION_ERROR, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['loadingNotification'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('APPROVE_ON_BOARDING', () => {
    const mockAction = { meta: {}, type: types.APPROVE_ON_BOARDING, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['loadingApproveOnBoarding'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('APPROVE_ON_BOARDING_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.APPROVE_ON_BOARDING_SUCCESS, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['approveDate'], moment(new Date()).format(formatDate))
      .setIn(['loadingApproveOnBoarding'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('APPROVE_ON_BOARDING_ERROR', () => {
    const mockAction = { meta: {}, type: types.APPROVE_ON_BOARDING_ERROR, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['loadingApproveOnBoarding'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DECLINE_APPROVE', () => {
    const mockAction = { meta: {}, type: types.DECLINE_APPROVE, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['loadingDeclineApprove'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DECLINE_APPROVE_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.DECLINE_APPROVE_SUCCESS, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['loadingDeclineApprove'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DECLINE_APPROVE_ERROR', () => {
    const mockAction = { meta: {}, type: types.DECLINE_APPROVE_ERROR, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['loadingDeclineApprove'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DATES_GET', () => {
    const mockAction = { meta: {}, type: types.DATES_GET, payload: { section: 'medical' } };
    const mockState = state
      .setIn(['sentDate'], state.get('sentDate'))
      .setIn(['approveDate'], state.get('approveDate'))
      .setIn(['summaryDate'], state.get('summaryDate'))
      .setIn(['quoteDates'], state.get('quoteDates'))
      .setIn(['loadingNotification'], false)
      .setIn(['savingSummary'], fromJS({}))
      .setIn(['loadingQuotes'], fromJS({}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DATES_GET_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.DATES_GET_SUCCESS, payload: { notification: { date: new Date() }, onBoardingNotification: { date: new Date() } } };
    const mockState = state
      .setIn(['sentDate'], (mockAction.payload.notification.date !== 'N/A') ? moment(mockAction.payload.notification.date).format(formatDate) : 'N/A')
      .setIn(['approveDate'], (mockAction.payload.onBoardingNotification.date !== 'N/A') ? moment(mockAction.payload.onBoardingNotification.date).format(formatDate) : 'N/A');
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DATES_GET_ERROR', () => {
    const mockAction = { meta: {}, type: types.DATES_GET_ERROR, payload: { section: 'medical' } };
    expect(reducer(undefined, mockAction)).toEqual(state);
  });

  it('DATE_SUMMARY_GET_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.DATE_SUMMARY_GET_SUCCESS, payload: { summary: { date: new Date() } } };
    const mockState = state
      .setIn(['summaryDate'], (mockAction.payload.summary.date !== 'N/A') ? moment(mockAction.payload.summary.date).format(formatDate) : 'N/A');
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DATE_SUMMARY_GET_ERROR', () => {
    const mockAction = { meta: {}, type: types.DATE_SUMMARY_GET_ERROR, payload: { section: 'medical' } };
    expect(reducer(undefined, mockAction)).toEqual(state);
  });

  it('DATES_QUOTES_GET_SUCCESS', () => {
    const mockAction = { meta: {}, type: types.DATES_QUOTES_GET_SUCCESS, payload: { quotes: [] } };
    const quoteDates = state.get('quoteDates');
    const medicalEasy = false;
    const kaiserEasy = false;
    const quoteFileName = { medical: '', dental: '', kaiser: '', vision: '' };
    const mockState = state
      .setIn(['quoteDates'], quoteDates)
      .setIn(['medical', 'quoteIsEasy'], medicalEasy)
      .setIn(['kaiser', 'quoteIsEasy'], kaiserEasy)
      .setIn(['medical', 'quoteFileName'], quoteFileName.medical)
      .setIn(['kaiser', 'quoteFileName'], quoteFileName.kaiser)
      .setIn(['dental', 'quoteFileName'], quoteFileName.dental)
      .setIn(['vision', 'quoteFileName'], quoteFileName.vision);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DATES_QUOTES_GET_ERROR', () => {
    const mockAction = { meta: {}, type: types.DATES_QUOTES_GET_ERROR, payload: { section: 'medical' } };
    expect(reducer(undefined, mockAction)).toEqual(state);
  });

  it('CHANGE_OPTION1_GROUP', () => {
    const action = { meta: { section: 'medical' }, type: types.CHANGE_OPTION1_GROUP, payload: { networkGroup: 'test', planId: 1 } };
    const mockState = state
      .setIn([action.meta.section, 'option1', action.payload.planId.toString(), 'networkGroup'], action.payload.networkGroup);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_OPTION1', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.CHANGE_OPTION1, payload: { planId: 1, optionId: 1 } };
    const option1State = state.get(mockAction.meta.section).get('option1');
    const mockState = state
      .setIn([mockAction.meta.section, 'option1'], option1State);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_OPTION1_MATCH', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.CHANGE_OPTION1_MATCH, payload: { planId: 1, rfpQuoteNetwork: {} } };
    const mockState = state
      .setIn([mockAction.meta.section, 'option1', mockAction.payload.planId.toString(), 'pnnId'], mockAction.payload.rfpQuoteNetwork);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('QUOTE_NETWORKS_GET', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.QUOTE_NETWORKS_GET, payload: { } };
    const mockState = state
      .setIn(['loadingOption1'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('QUOTE_NETWORKS_GET_SUCCESS', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.QUOTE_NETWORKS_GET_SUCCESS, payload: { networks: [], quotesLatest: {}, option1: {} } };
    const quotesLatest = mockAction.payload.quotesLatest;
    const latestFinal = {
      medical: quotesLatest.medical,
      kaiser: quotesLatest.kaiser,
      dental: quotesLatest.dental,
      vision: quotesLatest.vision,
    };
    const options1Final = {
      medical: state.get('medical').get('option1').toJS(),
      kaiser: state.get('kaiser').get('option1').toJS(),
      dental: state.get('dental').get('option1').toJS(),
      vision: state.get('vision').get('option1').toJS(),
    };
    const networks = {
      medical: state.get('medical').get('quoteNetworks'),
      kaiser: state.get('kaiser').get('quoteNetworks'),
      dental: state.get('dental').get('quoteNetworks'),
      vision: state.get('vision').get('quoteNetworks'),
    };
    const mockState = state
      .setIn(['loadingOption1'], false)
      .setIn(['medical', 'quoteNetworks'], fromJS(networks.medical || {}))
      .setIn(['kaiser', 'quoteNetworks'], fromJS(networks.kaiser || {}))
      .setIn(['dental', 'quoteNetworks'], fromJS(networks.dental || {}))
      .setIn(['vision', 'quoteNetworks'], fromJS(networks.vision || {}))
      .setIn(['medical', 'quotesLatest'], latestFinal.medical)
      .setIn(['kaiser', 'quotesLatest'], latestFinal.kaiser)
      .setIn(['dental', 'quotesLatest'], latestFinal.dental)
      .setIn(['vision', 'quotesLatest'], latestFinal.vision)
      .setIn(['medicalRenewal', 'quotesLatest'], latestFinal.medicalRenewal)
      .setIn(['dentalRenewal', 'quotesLatest'], latestFinal.dentalRenewal)
      .setIn(['visionRenewal', 'quotesLatest'], latestFinal.visionRenewal)
      .setIn(['medical', 'option1'], fromJS(options1Final.medical || {}))
      .setIn(['kaiser', 'option1'], fromJS(options1Final.kaiser || {}))
      .setIn(['dental', 'option1'], fromJS(options1Final.dental || {}))
      .setIn(['vision', 'option1'], fromJS(options1Final.vision || {}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('QUOTE_NETWORKS_GET_ERROR', () => {
    const mockAction = { meta: { section: 'medical' }, type: types.QUOTE_NETWORKS_GET_ERROR, payload: { } };
    const mockState = state
      .setIn(['loadingOption1'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DIFFERENCE_GET_SUCCESS', () => {
    const mockAction = { type: types.DIFFERENCE_GET_SUCCESS, payload: [] };
    const mockState = state
      .setIn(['medical', 'option1Difference'], fromJS([]))
      .setIn(['dental', 'option1Difference'], fromJS([]))
      .setIn(['vision', 'option1Difference'], fromJS([]))
      .setIn(['loadingOption1Difference'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DIFFERENCE_GET_ERROR', () => {
    const mockAction = { type: types.DIFFERENCE_GET_ERROR, payload: [] };
    const mockState = state
      .setIn(['loadingOption1Difference'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENT_TEAM_SAVE', () => {
    const mockAction = { type: types.CLIENT_TEAM_SAVE };
    const mockState = state.setIn(['savingClients'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENT_TEAM_SAVE_ERROR', () => {
    const mockAction = { type: types.CLIENT_TEAM_SAVE_ERROR };
    const mockState = state.setIn(['savingClients'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENT_TEAM_SAVE_SUCCESS', () => {
    const mockAction = { type: types.CLIENT_TEAM_SAVE_SUCCESS, payload: { addBrMembers: [], dataAdd: [], removeMembers: [], dataAddGA: [] } };
    const mockState = state
      .setIn(['savingClients'], false)
      .setIn(['createAccountsSuccess'], fromJS(false))
      .setIn(['clientTeamOriginal'], fromJS([]))
      .setIn(['brClientTeam'], fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENT_TEAM_NO_CHANGE', () => {
    const mockAction = { type: types.CLIENT_TEAM_NO_CHANGE };
    const mockState = state
      .setIn(['savingClients'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENT_TEAM_CREATE_ACCOUNTS_SUCCESS', () => {
    const mockAction = { type: types.CLIENT_TEAM_CREATE_ACCOUNTS_SUCCESS };
    const mockState = state.setIn(['createAccountsSuccess'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENT_TEAM_CREATE_ACCOUNTS_ERROR', () => {
    const mockAction = { type: types.CLIENT_TEAM_CREATE_ACCOUNTS_ERROR };
    const mockState = state.setIn(['createAccountsError'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('empty CLIENT_TEAM_GET', () => {
    const mockAction = { type: types.CLIENT_TEAM_GET };
    const mockState = state
      .setIn(['loadingClientTeams'], true)
      .set('loadingContributions', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('empty CLIENT_TEAM_GET_SUCCESS', () => {
    const mockAction = { type: types.CLIENT_TEAM_GET_SUCCESS, payload: { gaList: [], gaTeams: [[]], brTeam: [] } };
    const mockState = state
      .set('loadingClientTeams', false)
      .set('gaList', fromJS(mockAction.payload.gaList))
      .setIn(['gaClientTeams'], fromJS(mockAction.payload.gaTeams))
      .setIn(['brClientTeam'], fromJS(mockAction.payload.brTeam));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('one ga CLIENT_TEAM_GET_SUCCESS', () => {
    const mockAction = { type: types.CLIENT_TEAM_GET_SUCCESS,
      payload: {
        gaTeams: [[{ fullName: 'name', email: 'e@ma.il' }],
        [{ fullName: 'name', email: 'e@ma.il' }]],
        brTeam: [{ fullName: 'name', email: 'e@ma.il' }],
        gaList: [],
      },
    };

    const mockState = state
    .set('loadingClientTeams', false)
    .set('gaList', fromJS(mockAction.payload.gaList))
    .setIn(['gaClientTeams'], fromJS(mockAction.payload.gaTeams))
    .setIn(['brClientTeam'], fromJS(mockAction.payload.brTeam));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('BR_CLIENT_TEAM_CHANGE', () => {
    const mockAction = { type: types.BR_CLIENT_TEAM_CHANGE, payload: { memIndex: 0, property: 'email', value: 'newTest@test.test' } };
    const mockState = state.setIn(['brClientTeam', mockAction.payload.memIndex, mockAction.payload.property], fromJS(mockAction.payload.value));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('BR_CLIENT_TEAM_REMOVE_LOCAL', () => {
    const mockAction = { type: types.BR_CLIENT_TEAM_REMOVE_LOCAL, payload: 0 };
    const STATE = { brClientTeam: [{ fullName: 'name', email: 'email' }], removedTeamMembers: [] };
    let mockState = fromJS(STATE);
    const currTeam = mockState.get('brClientTeam');
    const toDelete = mockState.getIn(['removedTeamMembers']).push(currTeam.get(mockAction.payload));
    mockState = mockState
      .setIn(['removedTeamMembers'], toDelete)
      .set('brClientTeam', state.get('brClientTeam').delete(mockAction.payload));

    expect(reducer(fromJS(STATE), mockAction)).toEqual(mockState);
  });

  it('BR_CLIENT_TEAM_REMOVE_LOCAL added', () => {
    const mockAction = { type: types.BR_CLIENT_TEAM_REMOVE_LOCAL, payload: 0 };
    const STATE = { brClientTeam: [{ fullName: 'name', email: 'email', added: true }] };
    let mockState = fromJS(STATE);
    mockState = mockState.set('brClientTeam', mockState.get('brClientTeam').delete(mockAction.payload));

    expect(reducer(fromJS(STATE), mockAction)).toEqual(mockState);
  });

  it('BR_CLIENT_TEAM_ADD', () => {
    const mockAction = { type: types.BR_CLIENT_TEAM_ADD, payload: 0 };
    const STATE = { brClientTeam: [{ fullName: 'initial', email: 'email' }] };
    let mockState = fromJS(STATE);
    mockState = mockState.setIn(['brClientTeam'], mockState.getIn(['brClientTeam']).push(Map({ fullName: '', email: '', added: true, brokerageId: mockAction.payload })));
    expect(reducer(fromJS(STATE), mockAction)).toEqual(mockState);
  });

  it('GA_CLIENT_TEAM_ADD', () => {
    const mockAction = { type: types.GA_CLIENT_TEAM_ADD, payload: 123 };
    const teamList = state.get('gaClientTeams').toJS();
    const newTeam = [{
      added: true,
      brokerageId: mockAction.payload,
      fullName: '',
      email: '',
    }];
    teamList.push(newTeam);
    const mockState = state.set('gaClientTeams', fromJS(teamList));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GA_CLIENT_TEAM_ADD_MEMBER', () => {
    const mockAction = { type: types.GA_CLIENT_TEAM_ADD_MEMBER, payload: 0 };
    const STATE = { gaClientTeams: [[{ fullName: 'name', email: 'email', brokerageId: 123 }]] };
    let mockState = fromJS(STATE);
    const currentTeam = mockState.get('gaClientTeams').toJS()[mockAction.payload];
    const newMember = {
      fullName: '',
      email: '',
      brokerageId: currentTeam[0].brokerageId,
      added: true,
    };
    currentTeam.push(newMember);
    mockState = mockState.setIn(['gaClientTeams', mockAction.payload], fromJS(currentTeam));
    expect(reducer(fromJS(STATE), mockAction)).toEqual(mockState);
  });

  it('GA_CLIENT_TEAM_CHANGE_MEMBER', () => {
    const mockAction = { type: types.GA_CLIENT_TEAM_CHANGE_MEMBER, payload: { outerIndex: 0, innerIndex: 0, type: 'fullName', value: 'testValue' } };
    const STATE = { gaClientTeams: [[{ fullName: 'name', email: 'email', brokerageId: 123 }]] };
    let mockState = fromJS(STATE);
    mockState = mockState.setIn(['gaClientTeams', mockAction.payload.outerIndex, mockAction.payload.innerIndex, mockAction.payload.type], mockAction.payload.value);
    expect(reducer(fromJS(STATE), mockAction)).toEqual(mockState);
  });

  it('GA_CLIENT_TEAM_REMOVE_MEMBER', () => {
    const mockAction = { type: types.GA_CLIENT_TEAM_REMOVE_MEMBER, payload: { outerIndex: 0, innerIndex: 0 } };
    const STATE = { gaClientTeams: [[{ fullName: 'name', email: 'email', brokerageId: 123 }]], removedTeamMembers: [] };
    let mockState = fromJS(STATE);
    const currentTeam = mockState.getIn(['gaClientTeams', mockAction.payload.outerIndex]);
    mockState = mockState
      .setIn(['removedTeamMembers'], state.get('removedTeamMembers').push(currentTeam.get(mockAction.payload.innerIndex)))
      .setIn(['gaClientTeams', mockAction.payload.outerIndex], currentTeam.delete(mockAction.payload.innerIndex));
    expect(reducer(fromJS(STATE), mockAction)).toEqual(mockState);
  });

  it('GA_CLIENT_TEAM_REMOVE_MEMBER added', () => {
    const mockAction = { type: types.GA_CLIENT_TEAM_REMOVE_MEMBER, payload: { outerIndex: 0, innerIndex: 0 } };
    const STATE = { gaClientTeams: [[{ fullName: 'name', email: 'email', brokerageId: 123, added: true }]], removedTeamMembers: [] };
    let mockState = fromJS(STATE);
    const currentTeam = mockState.getIn(['gaClientTeams', mockAction.payload.outerIndex]);
    mockState = mockState
      .setIn(['gaClientTeams', mockAction.payload.outerIndex], currentTeam.delete(mockAction.payload.innerIndex));
    expect(reducer(fromJS(STATE), mockAction)).toEqual(mockState);
  });

  it('MOVE_CLIENT_REASON_CHANGE', () => {
    const mockAction = { type: types.MOVE_CLIENT_REASON_CHANGE, payload: 'TEST' };
    const mockState = state.setIn(['moveReason'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('MOVE_CLIENT_CHECK_CHANGE', () => {
    const mockAction = { type: types.MOVE_CLIENT_CHECK_CHANGE, payload: true };
    const mockState = state.setIn(['moveCheck'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('MOVE_CLIENT_BROKERAGE_CHANGE', () => {
    const mockAction = { type: types.MOVE_CLIENT_BROKERAGE_CHANGE, payload: {} };
    const mockState = state.setIn(['selectedBrokerage'], fromJS({}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('MOVE_CLIENT', () => {
    const mockAction = { type: types.MOVE_CLIENT };
    const mockState = state.setIn(['loadingbrClientsPage'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('MOVE_CLIENT_SUCCESS', () => {
    const mockAction = { type: types.MOVE_CLIENT_SUCCESS };
    const mockState = state.setIn(['loadingbrClientsPage'], false)
      .setIn(['selectedBrokerage'], fromJS({}))
      .setIn(['moveCheck'], false)
      .setIn(['moveReason'], fromJS(''))
      .setIn(['clientTeamOriginal'], fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('MOVE_CLIENT_ERROR', () => {
    const mockAction = { type: types.MOVE_CLIENT_ERROR };
    const mockState = state.setIn(['loadingbrClientsPage'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_CLIENT_STATUS', () => {
    const mockAction = { type: types.CHANGE_CLIENT_STATUS };
    const mockState = state.setIn(['loadingbrClientsPage'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_CLIENT_STATUS_SUCCESS', () => {
    const mockAction = { type: types.CHANGE_CLIENT_SUCCESS };
    const mockState = state.setIn(['loadingbrClientsPage'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_CLIENT_STATUS_ERROR', () => {
    const mockAction = { type: types.CHANGE_CLIENT_ERROR };
    const mockState = state.setIn(['loadingbrClientsPage'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DELETE_QUOTE', () => {
    const mockAction = { type: types.DELETE_QUOTE, payload: { quoteType: 'dental' } };
    const mockState = state.setIn(['loadingQuotes', mockAction.payload.quoteType], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DELETE_QUOTE_SUCCESS', () => {
    const mockAction = { type: types.DELETE_QUOTE_SUCCESS, payload: { quoteType: 'dental' } };
    const mockState = state
      .setIn(['quoteDates', mockAction.payload.quoteType], state.get('quoteDates').get(mockAction.payload.quoteType))
      .setIn([mockAction.payload.quoteType, 'quoteFileName'], '')
      .setIn(['loadingQuotes', mockAction.payload.quoteType], false)
      .setIn(['quoteDates', mockAction.payload.quoteType], 'N/A');
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DELETE_QUOTE_ERROR', () => {
    const mockAction = { type: types.DELETE_QUOTE_ERROR, payload: { quoteType: 'dental' } };
    const mockState = state.setIn(['loadingQuotes', mockAction.payload.quoteType], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_SELECTED_PLAN', () => {
    const mockAction = {
      type: types.UPDATE_SELECTED_PLAN,
      payload: { index: '0', id: '345', key: 'test', value: 'testVal' },
    };
    const mockState = state.setIn(['changedPlans', mockAction.payload.index], fromJS({ client_plan_id: mockAction.payload.id, [mockAction.payload.key]: mockAction.payload.value }));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('RESET_PLAN_CHANGES', () => {
    const mockAction = { type: types.RESET_PLAN_CHANGES, payload: 0 };
    const mockState = state.deleteIn(['changedPlans', String(mockAction.payload)]);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_CONTRIBUTION', () => {
    const mockAction = { type: types.SAVE_CONTRIBUTION };
    const mockState = state.set('savingContributions', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_CONTRIBUTION_SUCCESS', () => {
    const mockAction = { type: types.SAVE_CONTRIBUTION_SUCCESS };
    const mockState = state.set('savingContributions', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_CONTRIBUTION_ERROR', () => {
    const mockAction = { type: types.SAVE_CONTRIBUTION_ERROR };
    const mockState = state.set('savingContributions', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_SELECTED_QUOTE_TYPE', () => {
    const mockAction = { type: types.CHANGE_SELECTED_QUOTE_TYPE, payload: 'RENEWAL' };
    const mockState = state.set('selectedQuoteType', mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPLOAD_MEDICAL_EXISTS', () => {
    const mockAction = { type: types.UPLOAD_MEDICAL_EXISTS };
    const mockState = state.setIn(['loadingQuotes', 'medical'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});
