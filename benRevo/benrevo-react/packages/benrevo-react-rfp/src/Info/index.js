import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  updateForm,
  addCarrier,
  removeCarrier,
  updateCarrier,
  setError,
  deleteError,
  setValid,
  sendRfp,
  changeShowErrors,
  changeCarrier,
} from '../actions';
import { selectCarrierYears } from '../selectors';
import RfpInfo from './Info';
import { selectWaitingPeriod } from './selectors';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[2].path;
  const infoState = state.get('rfp').get(section);
  const commonState = state.get('rfp').get('common');
  const clientsState = state.get('clients');
  const plans = infoState.get('plans') ? infoState.get('plans').toJS() : [];
  return {
    client: clientsState.get('current').toJS(),
    carriers: infoState.get('carriers').toJS(),
    carriersList: infoState.get('carrierList').toJS(),
    previousCarriers: infoState.get('previousCarriers').toJS(),
    daysAfterHire: infoState.get('daysAfterHire'),
    commission: infoState.get('commission'),
    payType: infoState.get('payType'),
    brokerOfRecord: infoState.get('brokerOfRecord'),
    formErrors: infoState.get('formErrors').toJS(),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    showErrors: commonState.get('showErrors'),
    waitingPeriodOptions: selectWaitingPeriod(),
    years: selectCarrierYears(state),
    plans,
    section,
    prefix: ownProps.prefix,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setValid: (section, valid) => { dispatch(setValid(section, valid)); },
    setError: (section, type, msg) => { dispatch(setError(section, type, msg)); },
    deleteError: (section, type) => { dispatch(deleteError(section, type)); },
    updateForm: (section, name, value) => { dispatch(updateForm(section, name, value)); },
    addCarrier: (section, type) => { dispatch(addCarrier(section, type)); },
    updateCarrier: (section, type, key, value, index, clearPlans) => { dispatch(updateCarrier(section, type, key, value, index, clearPlans)); },
    removeCarrier: (section, type, index) => { dispatch(removeCarrier(section, type, index)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    sendRfp: (payload) => { dispatch(sendRfp(payload)); },
    changeCarrier: (section, carrierId, index, planType, clearNetwork) => { dispatch(changeCarrier(section, carrierId, index, planType, clearNetwork)); },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/rfp/${page}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RfpInfo);
