import { connect } from 'react-redux';
import Send from './Send';
import {
  getQuotePlans,
  changeDiscount,
  getSummary,
  changeSummary,
  changeSentBroker,
  sendToBroker,
} from '../actions';

function mapStateToProps(state) {
  const clientsState = state.get('clients');
  const sendState = state.get('rfp').get('send');
  const raterState = state.get('rfp').get('rater');

  return {
    products: clientsState.get('current').get('products').toJS(),
    client: clientsState.get('current').toJS(),
    history: raterState.get('history').toJS(),
    summaries: sendState.get('summaries').toJS(),
    clientMembers: sendState.get('clientMembers').toJS(),
    premiumCredit: sendState.get('premiumCredit'),
    projectedBundleDiscount: sendState.get('projectedBundleDiscount'),
    totalAnnualPremiumWithDiscount: sendState.get('totalAnnualPremiumWithDiscount'),
    projectedBundleDiscountPercent: sendState.get('projectedBundleDiscountPercent'),
    totalAnnualPremium: sendState.get('totalAnnualPremium'),
    medicalDiscount: sendState.get('medicalDiscount'),
    dentalDiscount: sendState.get('dentalDiscount'),
    visionDiscount: sendState.get('visionDiscount'),
    lifeDiscount: sendState.get('lifeDiscount'),
    sent: sendState.get('sent'),
    sending: sendState.get('sending'),
    quotes: {
      medical: sendState.get('medicalQuote').toJS(),
      kaiser: sendState.get('kaiserQuote').toJS(),
      dental: sendState.get('dentalQuote').toJS(),
      vision: sendState.get('visionQuote').toJS(),
      life: sendState.get('lifeQuote').toJS(),
    },
    discounts: {
      medical: sendState.get('medicalDiscount'),
      dental: sendState.get('dentalDiscount'),
      vision: sendState.get('visionDiscount'),
      life: sendState.get('lifeDiscount'),
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getQuotePlans: () => { dispatch(getQuotePlans()); },
    sendToBroker: () => { dispatch(sendToBroker()); },
    getSummary: () => { dispatch(getSummary()); },
    changeSentBroker: (sent) => { dispatch(changeSentBroker(sent)); },
    changeDiscount: (product, select) => { dispatch(changeDiscount(product, select)); },
    changeSummary: (value, section) => { dispatch(changeSummary(value, section)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Send);
