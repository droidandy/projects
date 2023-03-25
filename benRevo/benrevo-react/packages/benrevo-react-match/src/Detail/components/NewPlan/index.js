import { connect } from 'react-redux';
import { getMode } from '@benrevo/benrevo-react-quote';
import NewPlan from './NewPlan';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const clientsState = state.get('clients');
  const overviewState = state.get('presentation').get(section);
  const violationNotification = overviewState.get('violationNotification').toJS();
  const openedOption = overviewState.get('openedOption').toJS();
  return {
    newPlan: overviewState.get('newPlan').toJS(),
    page: overviewState.get('page').toJS(),
    openedOption,
    accordionActiveIndex: state.get('presentation').get('accordionActiveIndex').toJS(),
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
    client: clientsState.get('current').toJS(),
    contributions: overviewState.get('openedOptionContributions').toJS(),
    violationStatus: violationNotification[openedOption.id],
    section,
  };
}

export default connect(mapStateToProps)(NewPlan);

