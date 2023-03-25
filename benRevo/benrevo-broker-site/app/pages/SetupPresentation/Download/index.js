import { connect } from 'react-redux';
import { getClient } from '@benrevo/benrevo-react-clients';
import { downloadPresentation } from '../actions';
import Download from './Download';

function mapStateToProps(state, ownProps) {
  const clientsState = state.get('clients');
  const setupPresentationState = state.get('setupPresentation').toJS();
  const { loadingPresentationFile } = setupPresentationState;
  const { clientId } = ownProps.params;
  return {
    client: clientsState.get('current').toJS(),
    clientId,
    loadingPresentationFile,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    getCurrentClient: (clientId) => { dispatch(getClient(clientId)); },
    downloadPresentation: (clientId, type) => { dispatch(downloadPresentation(clientId, type)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Download);
