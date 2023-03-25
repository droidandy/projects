import { connect } from 'react-redux';
import PlanNetworksDropdown from './PlanNetworksDropdown';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const overviewState = state.get('presentation').get(section);
  return {
    openedOption: overviewState.get('openedOption').toJS(),
    networks: overviewState.get('networks').toJS(),
    section,
  };
}

function mapDispatchToProps(/* dispatch */) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanNetworksDropdown);

