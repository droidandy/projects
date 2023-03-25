import { connect } from 'react-redux';
import { updateCarrier, carrierToDefault, plansToDefault, selectAllPlans, changeCarrier } from '@benrevo/benrevo-react-rfp';
import { changeSelectedProducts, changeVirginCoverage } from '@benrevo/benrevo-react-clients';
import Products from './Products';
import { selectOtherCarrier } from '../selectors';

function mapStateToProps(state) {
  const clientsState = state.get('clients');
  const appState = state.get('app');

  return {
    otherCarrier: selectOtherCarrier(state, 'medical'),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    plans: selectAllPlans(state),
    carriersLoaded: appState.get('carriersLoaded'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeSelectedProducts: (type, value) => { dispatch(changeSelectedProducts(type, value)); },
    changeVirginCoverage: (type, value) => { dispatch(changeVirginCoverage(type, value)); },
    carrierToDefault: (section, type) => { dispatch(carrierToDefault(section, type)); },
    plansToDefault: (section) => { dispatch(plansToDefault(section)); },
    changeCarrier: (section, carrierId, index, planType, clearNetwork) => { dispatch(changeCarrier(section, carrierId, index, planType, clearNetwork)); },
    updateCarrier: (section, type, key, value, index, clearPlans) => { dispatch(updateCarrier(section, type, key, value, index, clearPlans)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);
