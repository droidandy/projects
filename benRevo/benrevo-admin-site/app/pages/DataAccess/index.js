import { connect } from 'react-redux';
import DataAccess from './DataAccess';
import { removeAccessToClient, getGaClients } from './actions';

function mapStateToProps(state) {
  const overviewState = state.get('dataAccess');
  return {
    loadingDataAccessPage: overviewState.get('loadingDataAccessPage'),
    gaClients: overviewState.toJS().gaClients,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getGaClients: () => { dispatch(getGaClients()); },
    removeAccessToClient: (clientId) => { dispatch(removeAccessToClient(clientId)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(DataAccess);
