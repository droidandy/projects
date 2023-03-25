import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import LifeStdLtdRates from './LifeStdLtdRates';
import { setError, deleteError, setValid, sendRfp, changeShowErrors, updateRateForm, updateRateAgeForm, changeAgesRowsCount } from './../actions';

function mapStateToProps(state, ownProps) {
  const section = (!ownProps.routes) ? ownProps.section : ownProps.routes[3].path;
  const infoState = state.get('rfp').get(section);
  const commonState = state.get('rfp').get('common');
  const clientsState = state.get('clients');

  return {
    client: clientsState.get('current').toJS(),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    formErrors: infoState.get('formErrors').toJS(),
    showErrors: commonState.get('showErrors'),
    section,
    voluntaryPlan: infoState.get('voluntaryPlan').toJS(),
    basicPlan: infoState.get('basicPlan').toJS(),
    addNewRangeFirstDisabled: infoState.toJS().addNewRangeFirstDisabled,
    addNewRangeLastDisabled: infoState.toJS().addNewRangeLastDisabled,
    maxFirstIndex: infoState.toJS().maxFirstIndex,
    maxLastIndex: infoState.toJS().maxLastIndex,
    prefix: ownProps.prefix,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setValid: (section, valid) => { dispatch(setValid(section, valid)); },
    setError: (section, type, msg, meta) => { dispatch(setError(section, type, msg, meta)); },
    deleteError: (section, type, meta) => { dispatch(deleteError(section, type, meta)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    updateForm: (section, rateType, rateField, value) => { dispatch(updateRateForm(section, rateType, rateField, value)); },
    updateAgeForm: (section, index, field, value) => { dispatch(updateRateAgeForm(section, index, field, value)); },
    changeAgesRowsCount: (section, index, actionType, position) => { dispatch(changeAgesRowsCount(section, index, actionType, position)); },
    sendRfp: (payload) => { dispatch(sendRfp(payload)); },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/rfp/${page}`));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LifeStdLtdRates);
