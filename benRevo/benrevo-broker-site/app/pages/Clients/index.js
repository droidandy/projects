import { connect } from 'react-redux';
import {
  sendClients,
  clientsSort,
} from '@benrevo/benrevo-react-clients';
import Clients from './Clients';

function mapStateToProps(state) {
  const clients = state.get('clients');

  return {
    loading: clients.get('loading'),
    clients: clients.get('clients').toJS(),
    sort: clients.get('sort').toJS(),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    getClients: () => { dispatch(sendClients()); },
    clientsSort: (prop) => { dispatch(clientsSort(prop)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients);
