import { connect } from 'react-redux';
import ExportClient from './ExportClient';
import { exportClient } from '../actions';

function mapStateToProps(state) {
  const clients = state.get('clients');
  return {
    client: clients.get('current').toJS(),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    exportClient: () => { dispatch(exportClient()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportClient);
