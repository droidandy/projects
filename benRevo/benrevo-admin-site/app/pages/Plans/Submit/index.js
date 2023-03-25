import { connect } from 'react-redux';
import { info } from 'react-notification-system-redux';
import PlanSubmit from './PlanSubmit';
import {
  uploadQuote,
  saveSummary,
  sendNotification,
  previewQuote,
  getQuoteNetworks,
  changeOption1,
  saveOption1,
  changeOption1Match,
  approveOnBoarding,
  changeQuoteType,
  uploadDentalQuote,
  getSummary,
  changeOption1Group,
  getDifference,
  changeUsage,
  deleteQuote,
  changeSelectedQuoteType,
  uploadMedicalExists,
} from '../actions';
import { selectCurrentPlanValid } from '../selectors';

function mapStateToProps(state) {
  const overviewState = state.get('plans');
  const filesState = state.get('plansFiles');
  const baseState = state.get('base');
  return {
    medicalUsage: overviewState.get('medical').get('option1Use'),
    kaiserUsage: overviewState.get('kaiser').get('option1Use'),
    dentalUsage: overviewState.get('dental').get('option1Use'),
    visionUsage: overviewState.get('vision').get('option1Use'),
    medicalRenewalUsage: overviewState.get('medicalRenewal').get('option1Use'),
    dentalRenewalUsage: overviewState.get('dentalRenewal').get('option1Use'),
    visionRenewalUsage: overviewState.get('visionRenewal').get('option1Use'),
    summaryDate: overviewState.get('summaryDate'),
    quoteDates: overviewState.get('quoteDates').toJS(),
    modLetterDate: overviewState.get('modLetterDate'),
    sentDate: overviewState.get('sentDate'),
    approveDate: overviewState.get('approveDate'),
    loadingPlans: overviewState.get('loadingPlans'),
    loadingSummary: overviewState.get('loadingSummary'),
    loadingOption1: overviewState.get('loadingOption1'),
    loadingNotification: overviewState.get('loadingNotification'),
    loadingApproveOnBoarding: overviewState.get('loadingApproveOnBoarding'),
    summaries: overviewState.get('summaries').toJS(),
    loadingQuotes: overviewState.get('loadingQuotes').toJS(),
    savingSummary: overviewState.get('savingSummary').toJS(),
    currentBroker: baseState.get('currentBroker').toJS(),
    selectedClient: baseState.get('selectedClient').toJS(),
    selectedCarrier: baseState.get('selectedCarrier').toJS(),
    clientPlans: overviewState.get('clientPlans').toJS(),
    quotesFiles: filesState.get('quotes').toJS(),
    previewFiles: filesState.get('preview').toJS(),
    currentPlanValid: selectCurrentPlanValid(state),
    quotesLatest: {
      medical: overviewState.get('medical').get('quotesLatest'),
      kaiser: overviewState.get('kaiser').get('quotesLatest'),
      dental: overviewState.get('dental').get('quotesLatest'),
      vision: overviewState.get('vision').get('quotesLatest'),
      medicalRenewal: overviewState.get('medicalRenewal').get('quotesLatest'),
      dentalRenewal: overviewState.get('dentalRenewal').get('quotesLatest'),
      visionRenewal: overviewState.get('visionRenewal').get('quotesLatest'),
    },
    quoteNetworks: {
      medical: overviewState.get('medical').get('quoteNetworks').toJS(),
      kaiser: overviewState.get('kaiser').get('quoteNetworks').toJS(),
      dental: overviewState.get('dental').get('quoteNetworks').toJS(),
      vision: overviewState.get('vision').get('quoteNetworks').toJS(),
      medicalRenewal: overviewState.get('medicalRenewal').get('quoteNetworks').toJS(),
      dentalRenewal: overviewState.get('dentalRenewal').get('quoteNetworks').toJS(),
      visionRenewal: overviewState.get('visionRenewal').get('quoteNetworks').toJS(),
    },
    option1: {
      medical: overviewState.get('medical').get('option1').toJS(),
      kaiser: overviewState.get('kaiser').get('option1').toJS(),
      dental: overviewState.get('dental').get('option1').toJS(),
      vision: overviewState.get('vision').get('option1').toJS(),
      medicalRenewal: overviewState.get('medicalRenewal').get('option1').toJS(),
      dentalRenewal: overviewState.get('dentalRenewal').get('option1').toJS(),
      visionRenewal: overviewState.get('visionRenewal').get('option1').toJS(),
    },
    option1Difference: {
      medical: overviewState.get('medical').get('option1Difference').toJS(),
      dental: overviewState.get('dental').get('option1Difference').toJS(),
      vision: overviewState.get('vision').get('option1Difference').toJS(),
      medicalRenewal: overviewState.get('medicalRenewal').get('option1Difference').toJS(),
      dentalRenewal: overviewState.get('dentalRenewal').get('option1Difference').toJS(),
      visionRenewal: overviewState.get('visionRenewal').get('option1Difference').toJS(),
    },
    quoteFileName: {
      medical: overviewState.get('medical').get('quoteFileName'),
      kaiser: overviewState.get('kaiser').get('quoteFileName'),
      dental: overviewState.get('dental').get('quoteFileName'),
      vision: overviewState.get('vision').get('quoteFileName'),
      medicalRenewal: overviewState.get('medicalRenewal').get('quoteFileName'),
      dentalRenewal: overviewState.get('dentalRenewal').get('quoteFileName'),
      visionRenewal: overviewState.get('visionRenewal').get('quoteFileName'),
    },
    quoteIsEasy: {
      medical: overviewState.get('medical').get('quoteIsEasy'),
      kaiser: overviewState.get('kaiser').get('quoteIsEasy'),
    },
    selectedQuoteType: overviewState.get('selectedQuoteType'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveSummary: (value, section) => { dispatch(saveSummary(value, section)); },
    changeQuoteType: (category, value) => { dispatch(changeQuoteType(category, value)); },
    getQuoteNetworks: () => { dispatch(getQuoteNetworks()); },
    getDifference: () => { dispatch(getDifference()); },
    sendNotification: () => { dispatch(sendNotification()); },
    approveOnBoarding: () => { dispatch(approveOnBoarding()); },
    saveOption1: () => { dispatch(saveOption1()); },
    uploadQuote: (data) => { dispatch(uploadQuote(data)); },
    uploadDentalQuote: (type, files, category, actionType) => { dispatch(uploadDentalQuote(type, files, category, actionType)); },
    previewQuote: (data) => { dispatch(previewQuote(data)); },
    changeOption1Group: (category, planId, networkGroup) => { dispatch(changeOption1Group(category, planId, networkGroup)); },
    changeOption1: (category, planId, rfpQuoteNetwork, optionId) => { dispatch(changeOption1(category, planId, rfpQuoteNetwork, optionId)); },
    changeOption1Match: (category, planId, rfpQuoteNetwork, optionId) => { dispatch(changeOption1Match(category, planId, rfpQuoteNetwork, optionId)); },
    getSummary: () => { dispatch(getSummary()); },
    changeUsage: (section, value) => { dispatch(changeUsage(section, value)); },
    deleteQuote: (quoteType) => { dispatch(deleteQuote(quoteType)); },
    showInfo: (notificationOpts) => {
      dispatch(info(notificationOpts));
    },
    uploadMedicalExists: (fileInfo) => { dispatch(uploadMedicalExists(fileInfo)); },
    changeSelectedQuoteType: (quoteType) => { dispatch(changeSelectedQuoteType(quoteType)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanSubmit);
