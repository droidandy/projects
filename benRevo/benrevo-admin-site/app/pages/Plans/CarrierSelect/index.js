import { connect } from 'react-redux';
import CarrierSelect from './CarrierSelect';
import { getCarrier, getBrokers, getClients, changeCarrier, changeBrokers, changeClients } from './actions';

function mapStateToProps(state) {
  const overviewState = state.get('base');
  return {
    loading: overviewState.get('loading'),
    carriers: overviewState.get('carriers').toJS(),
    brokers: overviewState.get('brokers').toJS(),
    clients: overviewState.get('clients').toJS(),
    selectedCarrier: overviewState.get('selectedCarrier').toJS(),
    selectedBroker: overviewState.get('selectedBroker').toJS(),
    currentBroker: overviewState.get('currentBroker').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCarrier: () => { dispatch(getCarrier()); },
    getBrokers: () => { dispatch(getBrokers()); },
    getClients: (brokerId) => { dispatch(getClients(brokerId)); },
    changeCarrier: (carrier) => { dispatch(changeCarrier(carrier)); },
    changeBrokers: (broker) => { dispatch(changeBrokers(broker)); },
    changeClients: (client) => {
      dispatch(changeClients(client));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CarrierSelect);
