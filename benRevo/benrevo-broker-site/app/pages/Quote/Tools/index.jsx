import { connect } from 'react-redux';
import Tools from './Tools';
import { getComparison } from '../actions';

function mapStateToProps(state) {
  const overviewState = state.get('presentation').get('medical');
  return {
    providersRows: overviewState.toJS().providersData,
    providersCols: overviewState.toJS().providersColumns,
    openedOption: overviewState.get('openedOption').toJS(),
    loading: overviewState.toJS().loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getComparison: () => { dispatch(getComparison()); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Tools);

