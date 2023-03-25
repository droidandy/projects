import { fromJS, Map } from 'immutable';
import moment from 'moment';
import * as types from './constants';
import HMO from './components/HMO';
import ANTHEM_HMO from './components/ANTHEM_HMO';
import PPO from './components/PPO';
import RXHMO from './components/RXHMO';
import RXHSA from './components/RXHSA';
import RXPPO from './components/RXPPO';
import HSA from './components/HSA';
import DHMO from './components/DHMO';
import DPPO from './components/DPPO';
import VISION from './components/Vision';
import { selectedCarrier } from '../../config';
import { extractFloat } from '../../utils/form';

const formatDate = 'MM.DD.YYYY';

const sectionState = {
  planAddedSuccess: false,
  loading: false,
  planChanged: false,
  carrierHistory: [],
  carrierHistoryGetError: null,
  networks: fromJS({}),
  plans: [],
  plansTemplatesDefined: false,
  option1: fromJS({}),
  option1Difference: fromJS([]),
  quoteNetworks: fromJS([]),
  quotesLatest: fromJS({}),
  quotePreview: fromJS({}),
  quoteIsEasy: false,
  quoteFileName: '',
  option1Use: true,
  isRenewal: false,
};

const initialState = fromJS({
  clientPlans: [],
  changedPlans: [],
  clientTeam: [],
  clientTeamOriginal: [],
  brClientTeam: [],
  gaClientTeams: [],
  removedTeamMembers: [],
  gaList: [],
  basePlans: [],
  savingClients: false,
  savingContributions: false,
  createAccountsSuccess: false,
  createAccountsError: false,
  loading: false,
  loadingPlans: false,
  loadingFilesPage: false,
  loadingSummary: false,
  loadingNotification: false,
  loadingApproveOnBoarding: false,
  loadingDeclineApprove: false,
  loadingOption1: false,
  loadingOption1Difference: false,
  savingSummary: {},
  loadingQuotes: {},
  loadingFiles: {},
  loadingbrClientsPage: false,
  loadingClientTeams: false,
  summaries: {},
  summaryLoaded: false,
  loadingContributions: false,
  files: [],
  brClients: [],
  history: [],
  plansTemplates: [],
  summaryDate: 'N/A',
  quoteDates: {
    medical: 'N/A',
    kaiser: 'N/A',
    dental: 'N/A',
    vision: 'N/A',
    medicalRenewal: 'N/A',
    dentalRenewal: 'N/A',
    visionRenewal: 'N/A',
  },
  sentDate: 'N/A',
  approveDate: 'N/A',
  modLetterDate: 'N/A',
  medical: {
    ...sectionState,
  },
  kaiser: {
    ...sectionState,
  },
  dental: {
    ...sectionState,
  },
  vision: {
    ...sectionState,
  },
  medicalRenewal: {
    ...sectionState,
    isRenewal: true,
    option1Use: true,
  },
  dentalRenewal: {
    ...sectionState,
    option1Use: true,
    isRenewal: true,
  },
  visionRenewal: {
    ...sectionState,
    option1Use: true,
    isRenewal: true,
  },
  selectedNetwork: {},
  selectedBrokerage: {},
  moveReason: '',
  moveCheck: false,
  selectedQuoteType: types.NEW_BUSINESS_TYPE,
});

function PlansReducer(state = initialState, action) {
  switch (action.type) {
    case types.FILES_GET: {
      return state
        .setIn(['loadingFiles'], fromJS({}))
        .setIn(['files'], fromJS([]))
        .setIn(['loadingFilesPage'], true);
    }
    case types.FILES_GET_SUCCESS: {
      return state
        .setIn(['loadingFilesPage'], false)
        .setIn(['files'], fromJS(action.payload));
    }
    case types.FILES_GET_ERROR: {
      return state
        .setIn(['loading'], false);
    }
    case types.GIVE_ACCESS_TO_CLIENT: {
      return state
        .setIn(['loadingbrClientsPage'], true);
    }
    case types.GIVE_ACCESS_TO_CLIENT_SUCCESS: {
      return state
        .setIn(['loadingbrClientsPage'], false);
    }
    case types.GIVE_ACCESS_TO_CLIENT_ERROR: {
      return state
        .setIn(['loadingbrClientsPage'], false);
    }
    case types.DOWNLOAD_FILE: {
      return state
         .setIn(['loadingFiles', action.payload.link], true);
    }
    case types.DOWNLOAD_FILE_SUCCESS: {
      return state
        .deleteIn(['loadingFiles', action.payload.link]);
    }
    case types.DOWNLOAD_FILE_ERROR: {
      return state
        .deleteIn(['loadingFiles', action.payload.link]);
    }
    case types.CHANGE_QUOTE_TYPE: {
      return state
        .setIn([action.meta.section, 'quoteIsEasy'], action.value);
    }
    case types.PREVIEW_QUOTE:
    case types.UPLOAD_QUOTE: {
      const category = (action.payload.kaiser) ? 'kaiser' : action.payload.category;
      return state
         .setIn(['loadingQuotes', category], true);
    }
    case types.PREVIEW_QUOTE_SUCCESS: {
      const info = action.payload.infoData;
      const category = (info.kaiser) ? 'kaiser' : info.category;
      return state
        .setIn(['loadingQuotes', category], true)
        .setIn([category, 'quotePreview'], fromJS(action.payload.data));
    }
    case types.UPLOAD_QUOTE_SUCCESS: {
      const categoryName = (action.payload.info.kaiser) ? 'kaiser' : action.payload.info.category;
      return state
        .setIn(['quoteDates', categoryName], moment(new Date()).format(formatDate))
        .setIn([categoryName, 'option1'], fromJS({}))
        .setIn([categoryName, 'quoteFileName'], action.payload.data.fileName)
        .deleteIn(['loadingQuotes', categoryName]);
    }
    case types.PREVIEW_QUOTE_ERROR:
    case types.UPLOAD_QUOTE_ERROR: {
      let category = (action.payload.kaiser) ? 'kaiser' : action.payload.category;

      if (action.payload.fileType) {
        category += action.payload.fileType;
      }
      return state
        .deleteIn(['loadingQuotes', category]);
    }
    case types.HISTORY_GET_SUCCESS: {
      return state
        .set('history', fromJS(action.payload));
    }
    case types.GET_CARRIER_HISTORY: {
      return state
        .setIn(['medical', 'carrierHistory'], fromJS([]))
        .setIn(['dental', 'carrierHistory'], fromJS([]))
        .setIn(['vision', 'carrierHistory'], fromJS([]))
        .setIn(['medical', 'networks'], fromJS({}))
        .setIn(['dental', 'networks'], fromJS({}))
        .setIn(['vision', 'networks'], fromJS({}));
    }
    case types.CARRIER_HISTORY_GET_SUCCESS: {
      return state
        .setIn([action.meta.section, 'carrierHistory'], fromJS(action.payload));
    }
    case types.CARRIER_HISTORY_GET_ERROR: {
      return state;
    }
    case types.PLAN_FIELD_UPDATE: {
      if (action.payload.valType === 'name') {
        const plans = state.get(action.meta.section).toJS().plans;
        plans[action.payload.index1].planName = action.payload.value;
        return state
          .setIn([action.meta.section, 'planChanged'], true)
          .setIn([action.meta.section, 'plans'], fromJS(plans));
      }
      if (action.payload.rxFlag) {
        const plans = state.get(action.meta.section).toJS().plans;
        if (plans && plans.length && plans[action.payload.index1] && plans[action.payload.index1].rx && plans[action.payload.index1].rx[action.payload.index2]) {
          plans[action.payload.index1].rx[action.payload.index2][action.payload.valType] = action.payload.value;
        }
        return state
          .setIn([action.meta.section, 'planChanged'], true)
          .setIn([action.meta.section, 'plans'], fromJS(plans));
      }
      const plans = state.get(action.meta.section).toJS().plans;
      if (plans && plans.length && plans[action.payload.index1] && plans[action.payload.index1].benefits && plans[action.payload.index1].benefits[action.payload.index2]) {
        plans[action.payload.index1].benefits[action.payload.index2][action.payload.valType] = action.payload.value;
      }
      return state
        .setIn([action.meta.section, 'planChanged'], true)
        .setIn([action.meta.section, 'plans'], fromJS(plans));
    }
    case types.CHANGE_CURRENT_CARRIER: {
      let selected = {};
      const carriers = state.get(action.meta.section).toJS().carrierHistory;
      carriers.forEach((item) => {
        if (item.carrierId === action.payload.carrierId) {
          selected = item;
          return true;
        }
        return true;
      });
      const plans = state.get(action.meta.section).toJS().plans;
      if (plans && plans.length && plans[action.payload.index]) {
        plans[action.payload.index].selectedCarrier = selected;
      }
      return state
        .setIn([action.meta.section, 'plans'], fromJS(plans));
    }
    case types.CHANGE_CURRENT_NETWORK: {
      let selected = {};
      const networkType = `${action.payload.planType}_${action.payload.carrierId}`;
      const networks = state.get(action.meta.section).toJS().networks[networkType];
      if (networks && networks.length) {
        networks.forEach((item) => {
          if (item.networkId === action.payload.networkId) {
            selected = item;
            return true;
          }
          return true;
        });
      }
      const plans = state.get(action.meta.section).toJS().plans;
      if (plans && plans.length && plans[action.payload.index]) {
        plans[action.payload.index].selectedNetwork = selected;
      }
      return state
        .setIn([action.meta.section, 'plans'], fromJS(plans));
    }
    case types.CLIENT_PLANS_GET: {
      return state
        .setIn(['loadingPlans'], true)
        .setIn(['loadingContributions'], true);
    }
    case types.CLIENT_PLANS_GET_ERROR: {
      return state
        .setIn(['loadingPlans'], false)
        .setIn(['loadingContributions'], false);
    }
    case types.PLAN_GET: {
      return state
        .setIn(['clientPlans'], fromJS([]))
        .setIn(['loadingContributions'], true);
    }
    case types.PLAN_GET_ERROR: {
      return state
        .setIn(['loadingPlans'], false)
        .setIn(['loadingContributions'], false);
    }
    case types.PLAN_GET_SUCCESS: {
      const plans = action.payload.clientPlans;
      const plansTemplates = {
        medical: [],
        dental: [],
        vision: [],
      };
      const optionIds = {};
      const basePlans = action.payload.plans;
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

            if (!benefit || finalPlan.benefits[i].temp) {
              baseBenefits.splice(i, 0, finalPlan.benefits[i]);

              if (finalPlan.benefits[i].sysName === 'IP_DAY_MAX') {
                let INPATIENT_HOSPITAL = 0;
                let IP_COPAY_MAX = 0;

                for (let m = 0; m < baseBenefits.length; m += 1) {
                  if (baseBenefits[m].sysName === 'INPATIENT_HOSPITAL') {
                    INPATIENT_HOSPITAL = extractFloat(baseBenefits[m].value)[0];
                  } else if (baseBenefits[m].sysName === 'IP_COPAY_MAX') {
                    IP_COPAY_MAX = extractFloat(baseBenefits[m].value)[0];
                  }
                }
                const ipDatMaxValue = (INPATIENT_HOSPITAL !== null && IP_COPAY_MAX !== null) ? IP_COPAY_MAX / INPATIENT_HOSPITAL : 0;
                baseBenefits[i].value = ipDatMaxValue || '';
              }
            } else {
              baseBenefits[i].placeholder = benefit.placeholder || undefined;
              baseBenefits[i].placeholderIn = benefit.placeholderIn || undefined;
              baseBenefits[i].placeholderOut = benefit.placeholderOut || undefined;
              baseBenefits[i].options = benefit.options || undefined;
              baseBenefits[i].hidden = benefit.hidden || undefined;

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

      return state
        .setIn(['clientPlans'], fromJS(action.payload.clientPlans))
        .setIn(['basePlans'], fromJS(action.payload.plans))
        .setIn(['changedPlans'], fromJS([]))
        .setIn(['loadingPlans'], false)
        .setIn(['loadingContributions'], false)
        .setIn(['medical', 'plansTemplatesDefined'], true)
        .setIn(['dental', 'plansTemplatesDefined'], true)
        .setIn(['vision', 'plansTemplatesDefined'], true)
        // setting plans template
        .setIn(['medical', 'plans'], fromJS(plansTemplates.medical))
        .setIn(['dental', 'plans'], fromJS(plansTemplates.dental))
        .setIn(['vision', 'plans'], fromJS(plansTemplates.vision));
    }
    case types.UPDATE_PLANS_PAGE: {
      return state
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
        .setIn(['medicalRenewal', 'option1Difference'], fromJS([]))
        .setIn(['dentalRenewal', 'option1Difference'], fromJS([]))
        .setIn(['visionRenewal', 'option1Difference'], fromJS([]))
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
    }
    case types.PLAN_CREATE: {
      return state
        .setIn([action.meta.section, 'loading'], true);
    }
    case types.PLAN_CREATE_SUCCESS: {
      return state
        .setIn([action.meta.section, 'planAddedSuccess'], true)
        .setIn([action.meta.section, 'loading'], false);
    }
    case types.PLAN_CREATE_ERROR: {
      return state
        .setIn([action.meta.section, 'planAddedSuccess'], false)
        .setIn([action.meta.section, 'loading'], false);
    }
    case types.NETWORKS_GET_SUCCESS: {
      const networkType = `${(action.payload.planType === 'H.S.A') ? 'HSA' : action.payload.planType}_${action.payload.carrierId}`;
      return state
        .setIn([action.meta.section, 'networks', networkType], fromJS(action.payload.networks))
        .set('loading', false);
    }
    case types.HISTORY_GET_ERROR: {
      return state;
    }

    /*
     * Plan Submit
     *
     */

    case types.SUMMARY_GET: {
      return state
        .setIn(['summaries'], fromJS({}))
        .setIn(['loadingSummary'], true)
        .setIn(['summaryLoaded'], false);
    }
    case types.SUMMARY_GET_SUCCESS: {
      if (!action.payload.medicalNotes && !action.payload.medicalWithKaiserNotes && !action.payload.dentalNotes && !action.payload.visionNotes) {
        return state.setIn(['loadingSummary'], false);
      }
      return state
        .setIn(['summaryLoaded'], true)
        .setIn(['loadingSummary'], false)
        .setIn(['summaries', 'medical'], action.payload.medicalNotes)
        .setIn(['summaries', 'kaiser'], action.payload.medicalWithKaiserNotes)
        .setIn(['summaries', 'dental'], action.payload.dentalNotes)
        .setIn(['summaries', 'vision'], action.payload.visionNotes)
        .setIn(['modLetterDate'], action.payload.fileUpdated ? moment(action.payload.fileUpdated).format(formatDate) : 'N/A');
    }
    case types.SUMMARY_GET_ERROR: {
      return state
        .setIn(['loadingSummary'], false);
    }
    case types.SUMMARY_SAVE: {
      return state
        .setIn(['summaries', action.payload.section], action.payload.value)
        .setIn(['savingSummary', action.payload.section], true);
    }
    case types.SUMMARY_SAVE_SUCCESS: {
      return state
        .setIn(['summaryDate'], moment(new Date()).format(formatDate))
        .setIn(['summaryLoaded'], true)
        .setIn(['savingSummary', action.payload.section], false);
    }
    case types.SUMMARY_SAVE_ERROR: {
      return state
        .setIn(['savingSummary'], false);
    }
    case types.SEND_NOTIFICATION: {
      return state
        .setIn(['loadingNotification'], true);
    }
    case types.SEND_NOTIFICATION_SUCCESS: {
      return state
        .setIn(['sentDate'], moment(new Date()).format(formatDate))
        .setIn(['loadingNotification'], false);
    }
    case types.SEND_NOTIFICATION_ERROR: {
      return state
        .setIn(['loadingNotification'], false);
    }
    case types.APPROVE_ON_BOARDING: {
      return state
        .setIn(['loadingApproveOnBoarding'], true);
    }
    case types.APPROVE_ON_BOARDING_SUCCESS: {
      return state
        .setIn(['approveDate'], moment(new Date()).format(formatDate))
        .setIn(['loadingApproveOnBoarding'], false);
    }
    case types.APPROVE_ON_BOARDING_ERROR: {
      return state
        .setIn(['loadingApproveOnBoarding'], false);
    }
    case types.DECLINE_APPROVE: {
      return state
        .setIn(['loadingDeclineApprove'], true);
    }
    case types.DECLINE_APPROVE_SUCCESS: {
      return state
        .setIn(['loadingDeclineApprove'], false);
    }
    case types.DECLINE_APPROVE_ERROR: {
      return state
        .setIn(['loadingDeclineApprove'], false);
    }
    case types.DATES_GET: {
      return state
        .setIn(['sentDate'], initialState.get('sentDate'))
        .setIn(['approveDate'], initialState.get('approveDate'))
        .setIn(['summaryDate'], initialState.get('summaryDate'))
        .setIn(['quoteDates'], initialState.get('quoteDates'))
        .setIn(['loadingNotification'], false)
        .setIn(['savingSummary'], fromJS({}))
        .setIn(['loadingQuotes'], fromJS({}));
    }
    case types.DATES_GET_SUCCESS: {
      return state
        .setIn(['sentDate'], (action.payload.notification.date !== 'N/A') ? moment(action.payload.notification.date).format(formatDate) : 'N/A')
        .setIn(['approveDate'], (action.payload.onBoardingNotification.date !== 'N/A') ? moment(action.payload.onBoardingNotification.date).format(formatDate) : 'N/A');
    }
    case types.DATES_GET_ERROR: {
      return state;
    }
    case types.DATE_SUMMARY_GET_SUCCESS: {
      return state
        .setIn(['summaryDate'], (action.payload.summary.date !== 'N/A') ? moment(action.payload.summary.date).format(formatDate) : 'N/A');
    }
    case types.DATE_SUMMARY_GET_ERROR: {
      return state;
    }
    case types.DATES_QUOTES_GET_SUCCESS: {
      let quoteDates = initialState.get('quoteDates');
      const quoteFileName = { medical: '', dental: '', kaiser: '', vision: '', medicalRenewal: '', dentalRenewal: '', visionRenewal: '' };
      let medicalEasy = false;
      let kaiserEasy = false;

      for (let i = 0; i < action.payload.quotes.length; i += 1) {
        const item = action.payload.quotes[i];

        if (item.date !== 'N/A') {
          if (item.name === 'Medical_without_kaiser') {
            quoteDates = quoteDates.setIn(['medical'], moment(item.date).format(formatDate));
            quoteFileName.medical = item.fileName;
            quoteDates = quoteDates.setIn(['medicalRenewal'], moment(item.date).format(formatDate));
            quoteFileName.medicalRenewal = item.fileName;
          } else if (item.name === 'Medical_with_kaiser') {
            quoteDates = quoteDates.setIn(['kaiser'], moment(item.date).format(formatDate));
            quoteFileName.kaiser = item.fileName;
          } else if (item.name === 'Dental') {
            quoteDates = quoteDates.setIn(['dental'], moment(item.date).format(formatDate));
            quoteFileName.dental = item.fileName;
            quoteDates = quoteDates.setIn(['dentalRenewal'], moment(item.date).format(formatDate));
            quoteFileName.dentalRenewal = item.fileName;
          } else if (item.name === 'Vision') {
            quoteDates = quoteDates.setIn(['vision'], moment(item.date).format(formatDate));
            quoteFileName.vision = item.fileName;
            quoteDates = quoteDates.setIn(['visionRenewal'], moment(item.date).format(formatDate));
            quoteFileName.visionRenewal = item.fileName;
          }
        }

        if (item.type === 'EASY' && item.name === 'Medical_with_kaiser') kaiserEasy = true;
        else if (item.type === 'EASY' && item.name === 'Medical_without_kaiser') medicalEasy = true;
      }

      return state
        .setIn(['quoteDates'], quoteDates)
        .setIn(['medical', 'quoteIsEasy'], medicalEasy)
        .setIn(['kaiser', 'quoteIsEasy'], kaiserEasy)
        .setIn(['medical', 'quoteFileName'], quoteFileName.medical)
        .setIn(['kaiser', 'quoteFileName'], quoteFileName.kaiser)
        .setIn(['dental', 'quoteFileName'], quoteFileName.dental)
        .setIn(['vision', 'quoteFileName'], quoteFileName.vision)
        .setIn(['medicalRenewal', 'quoteFileName'], quoteFileName.medicalRenewal)
        .setIn(['dentalRenewal', 'quoteFileName'], quoteFileName.dentalRenewal)
        .setIn(['visionRenewal', 'quoteFileName'], quoteFileName.visionRenewal);
    }
    case types.DATES_QUOTES_GET_ERROR: {
      return state;
    }
    case types.CHANGE_OPTION1_GROUP: {
      return state
        .setIn([action.meta.section, 'option1', action.payload.planId.toString(), 'networkGroup'], action.payload.networkGroup);
    }
    case types.CHANGE_USAGE: {
      return state
        .setIn([action.meta.section, 'option1Use'], action.payload);
    }
    case types.CHANGE_OPTION1: {
      if (action.payload.optionId) {
        const clientPlans = state.get('clientPlans');
        let option1State = state.get(action.meta.section).get('option1');

        clientPlans.map((item) => {
          if (item.get('client_plan_id') === action.payload.planId) {
            option1State = option1State.setIn([item.get('client_plan_id').toString(), 'quoteOptionName'], action.payload.rfpQuoteNetwork);
            option1State = option1State.deleteIn([item.get('client_plan_id').toString(), 'pnnId']);
          }
          return true;
        });

        return state
          .setIn([action.meta.section, 'option1'], option1State);
      }

      return state
        .setIn([action.meta.section, 'option1', action.payload.planId.toString(), 'quoteOptionName'], action.payload.rfpQuoteNetwork)
        .deleteIn([action.meta.section, 'option1', action.payload.planId.toString(), 'pnnId']);
    }
    case types.CHANGE_OPTION1_MATCH: {
      if (action.payload.optionId) {
        const clientPlans = state.get('clientPlans');
        let option1State = state.get(action.meta.section).get('option1');

        clientPlans.map((item) => {
          if (item.get('client_plan_id') === action.payload.planId) {
            option1State = option1State.setIn([item.get('client_plan_id').toString(), 'pnnId'], action.payload.rfpQuoteNetwork);
          }
          return true;
        });

        return state
          .setIn([action.meta.section, 'option1'], option1State);
      }

      return state
        .setIn([action.meta.section, 'option1', action.payload.planId.toString(), 'pnnId'], action.payload.rfpQuoteNetwork);
    }
    case types.QUOTE_NETWORKS_GET: {
      return state
        .setIn(['loadingOption1'], true);
    }
    case types.QUOTE_NETWORKS_GET_SUCCESS: {
      const fullNetworks = action.payload.networks;
      const quotesLatest = action.payload.quotesLatest;
      const options1 = action.payload.option1;
      const latestFinal = {
        medical: quotesLatest.medical,
        kaiser: quotesLatest.kaiser,
        dental: quotesLatest.dental,
        vision: quotesLatest.vision,
        medicalRenewal: quotesLatest.medicalRenewal,
        dentalRenewal: quotesLatest.dentalRenewal,
        visionRenewal: quotesLatest.visionRenewal,
      };
      const options1Final = {
        medical: state.get('medical').get('option1').toJS(),
        kaiser: state.get('kaiser').get('option1').toJS(),
        dental: state.get('dental').get('option1').toJS(),
        vision: state.get('vision').get('option1').toJS(),
        medicalRenewal: state.get('medicalRenewal').get('option1').toJS(),
        dentalRenewal: state.get('dentalRenewal').get('option1').toJS(),
        visionRenewal: state.get('visionRenewal').get('option1').toJS(),
      };
      const networks = {
        medical: state.get('medical').get('quoteNetworks'),
        kaiser: state.get('kaiser').get('quoteNetworks'),
        dental: state.get('dental').get('quoteNetworks'),
        vision: state.get('vision').get('quoteNetworks'),
        medicalRenewal: state.get('medicalRenewal').get('quoteNetworks'),
        dentalRenewal: state.get('dentalRenewal').get('quoteNetworks'),
        visionRenewal: state.get('visionRenewal').get('quoteNetworks'),
      };

      Object.keys(fullNetworks).map((item) => {
        networks[item] = [];

        for (let i = 0; i < fullNetworks[item].length; i += 1) {
          const network = { rfpQuoteNetwork: fullNetworks[item][i].rfpQuoteNetwork, matchPlan: {}, quoteNetworkPlans: [] };

          if (fullNetworks[item][i].matchQuoteNetworkPlans) {
            for (let j = 0; j < fullNetworks[item][i].matchQuoteNetworkPlans.length; j += 1) {
              const plan = fullNetworks[item][i].matchQuoteNetworkPlans[j];

              network.quoteNetworkPlans.push({
                key: plan.pnnId,
                value: plan.pnnId,
                text: plan.planName,
              });
            }
          } else if (fullNetworks[item][i].matchQuoteNetworkPlans && fullNetworks[item][i].matchQuoteNetworkPlans.length) {
            network.matchPlan = fullNetworks[item][i].matchQuoteNetworkPlans[0];
          }


          networks[item].push(network);
        }

        return true;
      });

      Object.keys(options1).map((item) => {
        options1Final[item] = {};

        for (let i = 0; i < options1[item].length; i += 1) {
          const option1 = options1[item][i];

          options1Final[item][option1.clientPlanId] = {};
          options1Final[item][option1.clientPlanId].quoteOptionName = option1.rfpQuoteNetwork;
          options1Final[item][option1.clientPlanId].previousQuoteOptionName = option1.rfpQuoteNetwork;

          if (option1.pnnId) options1Final[item][option1.clientPlanId].pnnId = option1.pnnId;
          if (option1.networkGroup) options1Final[item][option1.clientPlanId].networkGroup = option1.networkGroup;
        }

        return true;
      });

      return state
        .setIn(['loadingOption1'], false)
        .setIn(['medical', 'quoteNetworks'], fromJS(networks.medical || {}))
        .setIn(['kaiser', 'quoteNetworks'], fromJS(networks.kaiser || {}))
        .setIn(['dental', 'quoteNetworks'], fromJS(networks.dental || {}))
        .setIn(['vision', 'quoteNetworks'], fromJS(networks.vision || {}))
        .setIn(['medicalRenewal', 'quoteNetworks'], fromJS(networks.medicalRenewal || {}))
        .setIn(['dentalRenewal', 'quoteNetworks'], fromJS(networks.dentalRenewal || {}))
        .setIn(['visionRenewal', 'quoteNetworks'], fromJS(networks.visionRenewal || {}))
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
        .setIn(['vision', 'option1'], fromJS(options1Final.vision || {}))
        .setIn(['medicalRenewal', 'option1'], fromJS(options1Final.medicalRenewal || {}))
        .setIn(['dentalRenewal', 'option1'], fromJS(options1Final.dentalRenewal || {}))
        .setIn(['visionRenewal', 'option1'], fromJS(options1Final.visionRenewal || {}));
    }
    case types.QUOTE_NETWORKS_GET_ERROR: {
      return state
        .setIn(['loadingOption1'], false);
    }
    case types.DIFFERENCE_GET: {
      return state
        .setIn(['loadingOption1Difference'], true);
    }
    case types.DIFFERENCE_GET_SUCCESS: {
      const medical = [];
      const dental = [];
      const vision = [];
      const difference = action.payload;

      for (let i = 0; i < difference.length; i += 1) {
        const item = difference[i];

        if (item.plans) item.plans.unshift({ dollarDifference: item.totalDollarDifference, percentDifference: item.totalPercentDifference });

        if (item.product === 'MEDICAL') medical.push(item);
        else if (item.product === 'DENTAL') dental.push(item);
        else if (item.product === 'VISION') vision.push(item);
      }
      return state
        .setIn(['medical', 'option1Difference'], fromJS(medical))
        .setIn(['dental', 'option1Difference'], fromJS(dental))
        .setIn(['vision', 'option1Difference'], fromJS(vision))
        .setIn(['loadingOption1Difference'], false);
    }
    case types.DIFFERENCE_GET_ERROR: {
      return state
        .setIn(['loadingOption1Difference'], false);
    }
    case types.CLIENT_TEAM_SAVE: {
      return state
        .setIn(['savingClients'], true);
    }
    case types.CLIENT_TEAM_SAVE_ERROR: {
      return state.setIn(['savingClients'], false);
    }
    case types.CLIENT_TEAM_SAVE_SUCCESS: {
      return state
        .setIn(['savingClients'], false)
        .setIn(['createAccountsSuccess'], false);
    }
    case types.CLIENT_TEAM_NO_CHANGE: {
      return state
        .setIn(['savingClients'], false);
    }
    case types.CLIENT_TEAM_CREATE_ACCOUNTS_SUCCESS: {
      return state.setIn(['createAccountsSuccess'], true);
    }
    case types.CLIENT_TEAM_CREATE_ACCOUNTS_ERROR: {
      return state.setIn(['createAccountsError'], true);
    }
    case types.CLIENT_TEAM_GET: {
      return state
        .set('loadingClientTeams', true)
        .set('loadingContributions', true)
        .set('removedTeamMembers', fromJS([]));
    }
    case types.CLIENT_TEAM_GET_SUCCESS: {
      return state
        .set('loadingClientTeams', false)
        .set('gaList', fromJS(action.payload.gaList))
        .setIn(['gaClientTeams'], fromJS(action.payload.gaTeams))
        .setIn(['brClientTeam'], fromJS(action.payload.brTeam));
    }
    case types.BR_CLIENT_TEAM_CHANGE: {
      return state.setIn(['brClientTeam', action.payload.memIndex, action.payload.property], fromJS(action.payload.value));
    }
    case types.BR_CLIENT_TEAM_ADD: {
      return state.setIn(['brClientTeam'], state.getIn(['brClientTeam']).push(Map({ fullName: '', email: '', added: true, brokerageId: action.payload })));
    }
    case types.BR_CLIENT_TEAM_REMOVE_LOCAL: {
      const currTeam = state.get('brClientTeam');
      if (!currTeam.get(action.payload).toJS().added) {
        const toDelete = state.getIn(['removedTeamMembers']).push(currTeam.get(action.payload));
        return state
          .setIn(['removedTeamMembers'], toDelete)
          .set('brClientTeam', state.get('brClientTeam').delete(action.payload));
      }
      return state
        .set('brClientTeam', state.get('brClientTeam').delete(action.payload));
    }
    case types.GA_CLIENT_TEAM_ADD: {
      const teamList = state.get('gaClientTeams').toJS();
      const newTeam = [{
        added: true,
        brokerageId: action.payload,
        fullName: '',
        email: '',
      }];
      teamList.push(newTeam);
      return state
        .set('gaClientTeams', fromJS(teamList));
    }
    case types.GA_CLIENT_TEAM_ADD_MEMBER: {
      const currentTeam = state.get('gaClientTeams').toJS()[action.payload];
      const newMember = {
        fullName: '',
        email: '',
        brokerageId: currentTeam[0].brokerageId,
        added: true,
      };
      currentTeam.push(newMember);
      return state
        .setIn(['gaClientTeams', action.payload], fromJS(currentTeam));
    }
    case types.GA_CLIENT_TEAM_REMOVE_MEMBER: {
      const currentTeam = state.getIn(['gaClientTeams', action.payload.outerIndex]);
      if (currentTeam.toJS().length) {
        if (currentTeam.toJS()[action.payload.innerIndex].added) {
          return state.setIn(['gaClientTeams', action.payload.outerIndex], currentTeam.delete(action.payload.innerIndex));
        }
        return state
          .setIn(['removedTeamMembers'], state.get('removedTeamMembers').push(currentTeam.get(action.payload.innerIndex)))
          .setIn(['gaClientTeams', action.payload.outerIndex], currentTeam.delete(action.payload.innerIndex));
      }
      return state.set('gaClientTeams', state.get('gaClientTeams').delete(action.payload.outerIndex));
    }
    case types.GA_CLIENT_TEAM_CHANGE_MEMBER: {
      return state
        .setIn(['gaClientTeams', action.payload.outerIndex, action.payload.innerIndex, action.payload.type], action.payload.value);
    }
    case types.MOVE_CLIENT_REASON_CHANGE: {
      return state.set('moveReason', action.payload);
    }
    case types.MOVE_CLIENT_CHECK_CHANGE: {
      return state.set('moveCheck', action.payload);
    }
    case types.MOVE_CLIENT_BROKERAGE_CHANGE: {
      return state
        .set('selectedBrokerage', fromJS(action.payload));
    }
    case types.MOVE_CLIENT: {
      return state
        .setIn(['loadingbrClientsPage'], true);
    }
    case types.MOVE_CLIENT_SUCCESS: {
      return state
        .setIn(['loadingbrClientsPage'], false)
        .setIn(['selectedBrokerage'], fromJS({}))
        .set('moveCheck', false)
        .setIn(['moveReason'], fromJS(''));
    }
    case types.MOVE_CLIENT_ERROR: {
      return state
        .setIn(['loadingbrClientsPage'], false);
    }
    case types.CHANGE_CLIENT_STATUS: {
      return state
        .setIn(['loadingbrClientsPage'], true);
    }
    case types.CHANGE_CLIENT_STATUS_SUCCESS: {
      return state
        .setIn(['loadingbrClientsPage'], false);
    }
    case types.CHANGE_CLIENT_STATUS_ERROR: {
      return state
        .setIn(['loadingbrClientsPage'], false);
    }
    case types.DELETE_QUOTE: {
      return state
        .setIn(['loadingQuotes', action.payload.quoteType], true);
    }
    case types.DELETE_QUOTE_SUCCESS: {
      return state
        .setIn(['quoteDates', action.payload.quoteType], initialState.get('quoteDates').get(action.payload.quoteType))
        .setIn([action.payload.quoteType, 'quoteFileName'], '')
        .setIn(['loadingQuotes', action.payload.quoteType], false)
        .setIn(['quoteDates', action.payload.quoteType], 'N/A');
    }
    case types.DELETE_QUOTE_ERROR: {
      return state
        .setIn(['loadingQuotes', action.payload.quoteType], false);
    }
    case types.UPDATE_SELECTED_PLAN: {
      const updateObj = state.get('changedPlans').toJS();
      if (!updateObj[action.payload.index]) {
        updateObj[action.payload.index] = { client_plan_id: action.payload.id };
      }
      const value = action.payload.value;
      updateObj[action.payload.index][action.payload.key] = value;
      return state
        .set('changedPlans', fromJS(updateObj));
    }
    case types.RESET_PLAN_CHANGES: {
      return state
        .deleteIn(['changedPlans', String(action.payload)]);
    }
    case types.SAVE_CONTRIBUTION: {
      return state
        .set('savingContributions', true);
    }
    case types.SAVE_CONTRIBUTION_SUCCESS: {
      const oldData = state.get('clientPlans').toJS();
      const newData = state.get('changedPlans').toJS();

      for (let i = 0; i < newData.length; i += 1) {
        if (newData[i]) {
          Object.keys(newData[i]).forEach((key) => {
            const intData = parseInt(newData[i][key], 10);
            if (!isNaN(intData)) {
              oldData[i][key] = intData;
            } else {
              oldData[i][key] = newData[i][key];
            }
          });
        }
      }
      return state
        .set('changedPlans', initialState.get('changedPlans'))
        .set('clientPlans', fromJS(oldData))
        .set('savingContributions', false);
    }
    case types.SAVE_CONTRIBUTION_ERROR: {
      return state
        .set('savingContributions', false);
    }
    case types.CHANGE_SELECTED_QUOTE_TYPE: {
      return state
        .set('selectedQuoteType', action.payload);
    }
    case types.UPLOAD_MEDICAL_EXISTS: {
      return state
         .setIn(['loadingQuotes', 'medical'], true);
    }
    default:
      return state;
  }
}

export default PlansReducer;
