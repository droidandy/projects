import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Options from './Options';
import { changeCarrier, changeNetwork, addPlan, removePlan, updatePlan, changeTier, sendRfp, changeShowErrors } from './../actions';
import { selectOtherCarrier, selectPlansCarrierList } from '../selectors';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[2].path;
  const infoState = state.get('rfp').get(section);
  const commonState = state.get('rfp').get('common');
  const clientsState = state.get('clients');
  const carrierList = ownProps.carrierList;
  const carrierState = state.get('carrier');
  let plansLoaded = false;

  if (ownProps.plansLoaded !== undefined) plansLoaded = ownProps.plansLoaded;
  else if (carrierState) plansLoaded = carrierState.get('plansLoaded');

  return {
    client: clientsState.get('current').toJS(),
    planList: infoState.get('planList').toJS(),
    tier: infoState.get('tier'),
    optionCount: infoState.get('optionCount'),
    plans: infoState.get('plans').toJS(),
    maxOptions: infoState.get('maxOptions'),
    formErrors: infoState.get('formErrors').toJS(),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    showErrors: commonState.get('showErrors'),
    carrierList: carrierList || selectPlansCarrierList(state, section),
    planNetworks: infoState.get('rfpPlanNetworks').toJS(),
    otherCarrier: (ownProps.otherCarrier !== undefined) ? ownProps.otherCarrier : selectOtherCarrier(state, 'medical'),
    carriersLoaded: commonState.get('carriersLoaded'),
    plansLoaded,
    rfpCreated: commonState.get('rfpCreated'),
    section,
    prefix: ownProps.prefix,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeTier: (section, value) => { dispatch(changeTier(section, value)); },
    addPlan: (section) => { dispatch(addPlan(section)); },
    removePlan: (section) => { dispatch(removePlan(section)); },
    updatePlan: (section, key, value, index) => { dispatch(updatePlan(section, key, value, index)); },
    sendRfp: (payload) => { dispatch(sendRfp(payload)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
    changeCarrier: (section, carrierId, index, planType, clearNetwork) => { dispatch(changeCarrier(section, carrierId, index, planType, clearNetwork)); },
    changeNetwork: (section, networkId, index, planType) => { dispatch(changeNetwork(section, networkId, index, planType)); },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/rfp/${page}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);
