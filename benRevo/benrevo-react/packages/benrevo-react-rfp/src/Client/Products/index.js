import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { changeSelectedProducts, saveNewClient, updateClient, changeVirginCoverage } from '@benrevo/benrevo-react-clients';
import Products from './Products';
import { selectOtherCarrier, selectAllPlans } from '../../selectors';
import { updateCarrier, carrierToDefault, plansToDefault, sendRfp, changeCarrier } from '../../actions';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[2].path;
  const showDeclined = ownProps.showDeclined;
  const clientRfp = state.get('rfp').get(section);
  const commonState = state.get('rfp').get('common');
  const clientsState = state.get('clients');

  const data = {
    client: clientsState.get('current').toJS(),
    clientSaveInProgress: clientsState.get('clientSaveInProgress'),
    formErrors: clientRfp.get('formErrors').toJS(),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    carriersLoaded: commonState.get('carriersLoaded'),
    otherCarrier: selectOtherCarrier(state, 'medical'),
    plans: selectAllPlans(state),
    section,
  };

  if (showDeclined) {
    data.declinedOutside = clientsState.get('current').get('declinedOutside');
  }

  return data;
}

function mapDispatchToProps(dispatch) {
  return {
    changePage: (page) => {
      dispatch(push(`/rfp/${page}`));
    },
    updateClient: (name, value) => { dispatch(updateClient(name, value)); },
    changeSelectedProducts: (type, value) => { dispatch(changeSelectedProducts(type, value)); },
    changeVirginCoverage: (type, value) => { dispatch(changeVirginCoverage(type, value)); },
    saveClient: () => { dispatch(saveNewClient()); },
    updateCarrier: (section, type, key, value, index, clearPlans) => { dispatch(updateCarrier(section, type, key, value, index, clearPlans)); },
    carrierToDefault: (section, type) => { dispatch(carrierToDefault(section, type)); },
    plansToDefault: (section) => { dispatch(plansToDefault(section)); },
    sendRfp: (payload) => { dispatch(sendRfp(payload)); },
    changeCarrier: (section, carrierId, index, planType, clearNetwork) => { dispatch(changeCarrier(section, carrierId, index, planType, clearNetwork)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Products);
