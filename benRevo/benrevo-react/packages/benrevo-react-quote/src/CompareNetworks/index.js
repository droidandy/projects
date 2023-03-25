import { connect } from 'react-redux';
import Networks from './Networks';
import { getNetworksForCompare } from '../actions';

function mapStateToProps(state) {
  const overviewState = state.get('presentation').get('medical');
  return {
    openedOption: overviewState.get('openedOption').toJS(),
    compareNetworks: overviewState.get('compareNetworks').toJS(),
    loading: overviewState.toJS().loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getNetworksForCompare: (section) => { dispatch(getNetworksForCompare(section)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Networks);
