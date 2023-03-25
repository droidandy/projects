import { connect } from 'react-redux';
import Documents from './Documents';
import { getFile } from '../actions';
import { selectDocuments } from '../selectors';

function mapStateToProps(state) {
  const clients = state.get('clients');
  const documentsState = state.get('presentation').get('documents');
  return {
    client: clients.get('current').toJS(),
    data: selectDocuments(state),
    loading: documentsState.get('loading'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFile: (document) => { dispatch(getFile(document)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
