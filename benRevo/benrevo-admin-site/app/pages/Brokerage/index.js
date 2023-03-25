import { connect } from 'react-redux';
import Brokerage from './Brokerage';
import { updateBrokerage, selectBroker, revertChanges, saveChanges, setListType, getAuth0 } from './actions';
import { getBrokers, getClients, changeBrokers, changeClients } from '../Client/actions';

function mapStateToProps(state) {
  const brokerageState = state.get('brokerage');
  const overviewState = state.get('base');
  return {
    changedBrokerage: brokerageState.get('changedBrokerage').toJS(),
    selectedBroker: brokerageState.get('selectedBroker').toJS(),
    loading: brokerageState.get('loading'),
    peopleLoading: brokerageState.get('peopleLoading'),
    clientsLoading: overviewState.get('loading'),
    selectedCarrier: overviewState.get('selectedCarrier').toJS(),
    listType: brokerageState.get('listType'),
    clients: overviewState.get('clients').toJS(),
    auth0List: brokerageState.get('auth0List').toJS(),
    brokers: overviewState.get('brokers').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectBroker: (broker) => { dispatch(selectBroker(broker)); },
    updateBrokerage: (id, key, value) => { dispatch(updateBrokerage(id, key, value)); },
    revertChanges: () => { dispatch(revertChanges()); },
    saveChanges: () => { dispatch(saveChanges()); },
    getBrokers: () => { dispatch(getBrokers()); },
    getClients: (brokerId) => { dispatch(getClients(brokerId)); },
    changeBrokers: (id) => { dispatch(changeBrokers(id)); },
    changeClients: (client) => { dispatch(changeClients(client)); },
    setListType: (type) => { dispatch(setListType(type)); },
    getAuth0: (id) => { dispatch(getAuth0(id)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Brokerage);
