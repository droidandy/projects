import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { updateForm, setError, deleteError, setValid, updatePlanTier, sendRfp, changeShowErrors } from './../actions';
import Contribution from './Contribution';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[2].path;
  const infoState = state.get('rfp').get(section);
  const commonState = state.get('rfp').get('common');
  const clientsState = state.get('clients');

  return {
    client: clientsState.get('current').toJS(),
    plans: infoState.get('plans').toJS(),
    contributionType: infoState.get('contributionType'),
    buyUp: infoState.get('buyUp'),
    tier: infoState.get('tier'),
    formErrors: infoState.get('formErrors').toJS(),
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
    setError: (section, type, msg) => { dispatch(setError(section, type, msg)); },
    deleteError: (section, type) => { dispatch(deleteError(section, type)); },
    updateForm: (section, name, value) => { dispatch(updateForm(section, name, value)); },
    updatePlanTier: (section, planIndex, type, outOfStateType, tierIndex, value, outOfState) => { dispatch(updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState)); },
    sendRfp: (payload) => { dispatch(sendRfp(payload)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/rfp/${page}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contribution);
