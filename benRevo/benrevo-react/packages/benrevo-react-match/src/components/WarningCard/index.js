import { connect } from 'react-redux';
import WarningCard from './WarningCard';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const overviewState = state.get('presentation').get(section);
  const openedOption = overviewState.get('openedOption').toJS();
  const violationModalText = overviewState.get('violationModalText').toJS();
  const page = overviewState.get('page').toJS();
  const carrierName = page.carrier ? page.carrier.carrier.name : '';
  return {
    violationMessage: violationModalText[openedOption.id],
    carrierName,
  };
}

function mapDispatchToProps() {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(WarningCard);

