import { connect } from 'react-redux';
// get info about client from sagas (mock)
// renred page
import { getClient } from '@benrevo/benrevo-react-clients';
import Client from './Client';
import {
  getValidationStatus,
  getMarketingStatusList,
  selectClientsCarrier,
  updateCarrierList,
  updateMarketingStatusItem,
  deleteCarrier,
  getBrokerPrograms,
} from './actions';
import { getCarrierEmailsList } from './../../Admin/actions';

function mapStateToProps(state, ownProps) {
  const clientsState = state.get('clients');
  const clientPageState = state.get('client');
  const rfpCarriers = state.get('app').get('rfpcarriers').toJS();
  const { clientId } = ownProps.params;
  return {
    client: clientsState.get('current').toJS(),
    clientLoading: clientsState.get('loading'),
    products: clientsState.get('products').toJS(),
    clientValidationStatus: clientPageState.get('clientValidationStatus').toJS(),
    marketingStatusList: clientPageState.get('marketingStatusList').toJS(),
    programs: clientPageState.get('programs').toJS(),
    selectedCarriers: clientPageState.get('selectedCarriers').toJS(),
    loadingValidation: clientPageState.get('loadingValidation'),
    loadingMarketingStatusList: clientPageState.get('loadingMarketingStatusList'),
    clientId,
    rfpCarriers,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    getCurrentClient: (clientId) => { dispatch(getClient(clientId)); },
    getValidationStatus: (clientId) => { dispatch(getValidationStatus(clientId)); },
    getMarketingStatusList: (clientId) => { dispatch(getMarketingStatusList(clientId)); },
    getBrokerPrograms: (brokerId) => { dispatch(getBrokerPrograms(brokerId)); },
    selectCarrier: (carrier, section) => { dispatch(selectClientsCarrier(carrier, section)); },
    addCarrier: (clientId) => { dispatch(updateCarrierList(clientId)); },
    deleteCarrier: (clientId, carrierItem, section) => { dispatch(deleteCarrier(clientId, carrierItem, section)); },
    updateMarketingStatusItem: (itemId, marketingStatus, clientId) => { dispatch(updateMarketingStatusItem(itemId, marketingStatus, clientId)); },
    getCarrierEmailsList: () => { dispatch(getCarrierEmailsList()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Client);
