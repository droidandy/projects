import { connect } from 'react-redux';
import Client from './Client';
import { getBrokers, getClients, changeCarrier, changeBrokers, changeClients, getClientsByName, updateClientNameSearchText } from './actions';

function mapStateToProps(state) {
  const overviewState = state.get('base');
  return {
    loading: overviewState.get('loading'),
    selectError: overviewState.get('selectError'),
    carriers: overviewState.get('carriers').toJS(),
    brokers: overviewState.get('brokers').toJS(),
    clients: overviewState.get('clients').toJS(),
    selectedCarrier: overviewState.get('selectedCarrier').toJS(),
    selectedBroker: overviewState.get('selectedBroker').toJS(),
    clientNameSearchText: overviewState.get('clientNameSearchText'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateClientNameSearchText: (text) => { dispatch(updateClientNameSearchText(text)); },
    getBrokers: () => { dispatch(getBrokers()); },
    getClients: (brokerId) => { dispatch(getClients(brokerId)); },
    getClientsByName: (searchText) => { dispatch(getClientsByName(searchText)); },
    changeCarrier: (carrier) => { dispatch(changeCarrier(carrier)); },
    changeBrokers: (broker) => { dispatch(changeBrokers(broker)); },
    changeClients: (client) => {
      dispatch(changeClients(client));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Client);
