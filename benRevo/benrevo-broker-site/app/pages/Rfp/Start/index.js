import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { updateClient, saveNewClient } from '@benrevo/benrevo-react-clients';
import Start from './Start';

function mapStateToProps(state, ownProps) {
  const clientsState = state.get('clients');
  const { clientId } = ownProps.params;
  return {
    client: clientsState.get('current').toJS(),
    clientSaveInProgress: clientsState.get('clientSaveInProgress'),
    clientId,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    updateClient: (name, value) => { dispatch(updateClient(name, value)); },
    saveClient: () => { dispatch(saveNewClient()); },
    changePage: (nextPage) => { dispatch(push(nextPage)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Start);
