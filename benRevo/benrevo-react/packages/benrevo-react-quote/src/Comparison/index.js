import { connect } from 'react-redux';
import Comparison from './Comparison';
import { getComparison } from '../actions';

function mapStateToProps(state) {
  const overviewState = state.get('presentation').get('medical');
  return {
    rows: overviewState.toJS().medicalGroups,
    cols: overviewState.toJS().medicalGroupsColumns,
    openedOption: overviewState.get('openedOption').toJS(),
    loading: overviewState.toJS().loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getComparison: () => { dispatch(getComparison()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Comparison);
