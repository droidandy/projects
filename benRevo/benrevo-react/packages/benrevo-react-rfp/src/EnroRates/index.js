import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import EnroRates from './EnroRates';
import { updatePlanTier, setError, deleteError, setValid, sendRfp, changeShowErrors } from './../actions';

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
    prefix: ownProps.prefix,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setValid: (section, valid) => { dispatch(setValid(section, valid)); },
    setError: (section, type, msg, meta) => { dispatch(setError(section, type, msg, meta)); },
    deleteError: (section, type, meta) => { dispatch(deleteError(section, type, meta)); },
    updatePlanTier: (section, planIndex, type, outOfStateType, tierIndex, value, outOfState) => { dispatch(updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState)); },
    sendRfp: (payload) => { dispatch(sendRfp(payload)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/rfp/${page}`));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(EnroRates);
