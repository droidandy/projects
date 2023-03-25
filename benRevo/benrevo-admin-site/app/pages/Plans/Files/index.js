import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Files from './PlanFiles';
import { getFiles, downloadFile } from '../actions';

function mapStateToProps(state) {
  const overviewState = state.get('plans');
  const baseState = state.get('base');
  return {
    loadingFilesPage: overviewState.get('loadingFilesPage'),
    loadingFiles: overviewState.get('loadingFiles').toJS(),
    files: overviewState.toJS().files,
    currentBroker: baseState.get('currentBroker').toJS(),
    selectedClient: baseState.get('selectedClient').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFiles: () => { dispatch(getFiles()); },
    downloadFile: (file) => { dispatch(downloadFile(file)); },
    next: () => { dispatch(push('/client/plans/medical')); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Files);
