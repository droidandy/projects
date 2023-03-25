import { connect } from 'react-redux';
import { optionRiderSelect, optionRiderUnSelect } from '@benrevo/benrevo-react-quote';
import Riders from './Riders';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const presentationState = state.get('presentation');
  const overviewState = presentationState.get(section);
  return {
    page: overviewState.get('page').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
    quoteType: overviewState.get('openedOption').toJS().quoteType || '',
    rider: overviewState.get('openedOptionRider').toJS(),
    section,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    optionRiderSelect: (section, riderId, rfpQuoteOptionNetworkId, optionId) => { dispatch(optionRiderSelect(section, riderId, rfpQuoteOptionNetworkId, optionId)); },
    optionRiderUnSelect: (section, riderId, rfpQuoteOptionNetworkId, optionId) => { dispatch(optionRiderUnSelect(section, riderId, rfpQuoteOptionNetworkId, optionId)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Riders);

