import { connect } from 'react-redux';
import { getMode } from '@benrevo/benrevo-react-quote';
import ClearValueModal from './ClearValueModal';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const overviewState = state.get('presentation').get(section);
  const page = overviewState.get('page').toJS();
  return {
    section,
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
    networks: overviewState.get('networks').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
    carrier: (page.carrier && page.carrier.carrier) ? page.carrier.carrier.displayName : '',
  };
}

function mapDispatchToProps() {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(ClearValueModal);

