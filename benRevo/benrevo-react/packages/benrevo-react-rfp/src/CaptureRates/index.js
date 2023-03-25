import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import CaptureRates from './CaptureRates';
import { updatePlanTier, setError, deleteError, setValid, sendRfp, changeShowErrors, updatePlanBanded } from './../actions';

function mapStateToProps(state, ownProps) {
  const section = (!ownProps.routes) ? ownProps.section : ownProps.routes[3].path;
  const infoState = state.get('rfp').get(section);
  const commonState = state.get('rfp').get('common');
  const clientsState = state.get('clients');

  return {
    client: clientsState.get('current').toJS(),
    plans: infoState.get('plans').toJS(),
    formErrors: infoState.get('formErrors').toJS(),
    tier: infoState.get('tier'),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    showErrors: commonState.get('showErrors'),
    section,
    rateType: infoState.toJS().rateType,
    prefix: ownProps.prefix,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setValid: (section, valid) => { dispatch(setValid(section, valid)); },
    setError: (section, type, msg, meta) => { dispatch(setError(section, type, msg, meta)); },
    deleteError: (section, type, meta) => { dispatch(deleteError(section, type, meta)); },
    updatePlanTier: (section, planIndex, type, outOfStateType, tierIndex, value, outOfState) => { dispatch(updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState)); },
    updatePlanBanded: (section, index, path, value) => { dispatch(updatePlanBanded(section, index, path, value)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    sendRfp: (payload) => { dispatch(sendRfp(payload)); },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/rfp/${page}`));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CaptureRates);
