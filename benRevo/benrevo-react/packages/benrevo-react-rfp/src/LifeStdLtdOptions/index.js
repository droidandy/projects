import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import LifeStdLtdOptions from './LifeStdLtdOptions';
import { sendRfp, changeShowErrors, changeLifeStdLtdPlan, addLifeStdLtdPlan, removeLifeStdLtdPlan, changeLifeStdLtdPlanClass, updateForm } from '../actions';
import { selectSectionTitle, selectPlansCarrierList } from '../selectors';
import { selectOptions } from './selectors';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[2].path;
  const infoState = state.get('rfp').get(section);
  const commonState = state.get('rfp').get('common');
  const clientsState = state.get('clients');
  const carrierList = ownProps.carrierList;

  return {
    client: clientsState.get('current').toJS(),
    carrierList: carrierList || selectPlansCarrierList(state, section),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    formErrors: infoState.get('formErrors').toJS(),
    basicPlan: infoState.get('basicPlan').toJS(),
    voluntaryPlan: infoState.get('voluntaryPlan').toJS(),
    eap: infoState.get('eap'),
    visits: infoState.get('visits'),
    showErrors: commonState.get('showErrors'),
    dropdownOptions: selectOptions(),
    section,
    title: selectSectionTitle(section),
    prefix: ownProps.prefix,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    sendRfp: (payload) => { dispatch(sendRfp(payload)); },
    changeLifeStdLtdPlan: (section, type, key, value) => { dispatch(changeLifeStdLtdPlan(section, type, key, value)); },
    changeLifeStdLtdPlanClass: (section, type, key, value, index) => { dispatch(changeLifeStdLtdPlanClass(section, type, key, value, index)); },
    addLifeStdLtdPlan: (section, type) => { dispatch(addLifeStdLtdPlan(section, type)); },
    updateForm: (section, name, value) => { dispatch(updateForm(section, name, value)); },
    removeLifeStdLtdPlan: (section, type) => { dispatch(removeLifeStdLtdPlan(section, type)); },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/rfp/${page}`));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LifeStdLtdOptions);
