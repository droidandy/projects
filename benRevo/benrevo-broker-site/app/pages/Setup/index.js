import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { updateCarrier, carrierToDefault, plansToDefault, selectOtherCarrier, changeCarrier, selectAllPlans } from '@benrevo/benrevo-react-rfp';
import { changeSelectedProducts, updateClient, changeVirginCoverage, quoteNewClient, saveNewClient } from '@benrevo/benrevo-react-clients';
import Setup from './Setup';

function mapStateToProps(state, ownProps) {
  const clientsState = state.get('clients');
  const { clientId } = ownProps.params;

  return {
    client: clientsState.get('current').toJS(),
    otherCarrier: selectOtherCarrier(state, 'medical'),
    clientSaveInProgress: clientsState.get('clientSaveInProgress'),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    plans: selectAllPlans(state),
    clientId,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    updateClient: (name, value) => { dispatch(updateClient(name, value)); },
    changeSelectedProducts: (type, value) => { dispatch(changeSelectedProducts(type, value)); },
    changeVirginCoverage: (type, value) => { dispatch(changeVirginCoverage(type, value)); },
    updateCarrier: (section, type, key, value, index, clearPlans) => { dispatch(updateCarrier(section, type, key, value, index, clearPlans)); },
    carrierToDefault: (section, type) => { dispatch(carrierToDefault(section, type)); },
    plansToDefault: (section) => { dispatch(plansToDefault(section)); },
    quoteNewClient: () => { dispatch(quoteNewClient()); },
    saveClient: () => { dispatch(saveNewClient()); },
    changePage: (clientId) => { dispatch(push(`/clients/${clientId}`)); },
    changeCarrier: (section, carrierId, index, planType, clearNetwork) => { dispatch(changeCarrier(section, carrierId, index, planType, clearNetwork)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Setup);
