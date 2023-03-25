import { connect } from 'react-redux';
import {
  selectSectionTitle,
  updateForm,
  selectCarrierYears,
  updateCarrier,
  changeTier,
  addPlan,
  removePlan,
  updatePlan,
  changeNetwork,
  changeCarrier,
} from '@benrevo/benrevo-react-rfp';
import ProductInfo from './ProductInfo';
import { selectCarrierList, selectOtherCarrier, selectPlansCarrierList } from '../selectors';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[4].path;
  const appState = state.get('app');
  const infoState = state.get('rfp').get(section);
  const clientsState = state.get('clients');

  return {
    section,
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    planList: infoState.get('planList').toJS(),
    planNetworks: infoState.get('rfpPlanNetworks').toJS(),
    carriersLoaded: appState.get('carriersLoaded'),
    title: selectSectionTitle(section),
    commission: infoState.get('commission'),
    payType: infoState.get('payType'),
    years: selectCarrierYears(state),
    carriersList: selectCarrierList(state, section),
    carriers: infoState.get('carriers').toJS(),
    previousCarriers: infoState.get('previousCarriers').toJS(),
    tier: infoState.get('tier'),
    maxOptions: infoState.get('maxOptions'),
    optionCount: infoState.get('optionCount'),
    otherCarrier: selectOtherCarrier(state, 'medical'),
    plans: infoState.get('plans').toJS(),
    carrierList: selectPlansCarrierList(state, section),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateForm: (section, name, value) => { dispatch(updateForm(section, name, value)); },
    updateCarrier: (section, type, key, value, index, clearPlans) => { dispatch(updateCarrier(section, type, key, value, index, clearPlans)); },
    changeTier: (section, value) => { dispatch(changeTier(section, value)); },
    addPlan: (section) => { dispatch(addPlan(section)); },
    removePlan: (section) => { dispatch(removePlan(section)); },
    updatePlan: (section, key, value, index) => { dispatch(updatePlan(section, key, value, index)); },
    changeCarrier: (section, carrierId, index, planType, clearNetwork) => { dispatch(changeCarrier(section, carrierId, index, planType, clearNetwork)); },
    changeNetwork: (section, networkId, index, planType) => { dispatch(changeNetwork(section, networkId, index, planType)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductInfo);
