import { connect } from 'react-redux';
import AllPlansTab from './AllPlansTab';
import { getAlternativePlansForDropdown } from './../../../actions';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const clientsState = state.get('clients');
  const overviewState = state.get('presentation').get(section);
  const violationNotification = overviewState.get('violationNotification').toJS();
  const openedOption = overviewState.get('openedOption').toJS();
  return {
    openedOption,
    client: clientsState.get('current').toJS(),
    contributions: overviewState.get('openedOptionContributions').toJS(),
    plansForDropDown: overviewState.get('plansForDropDown').toJS(),
    plansForDropDownError: overviewState.get('plansForDropDownError'),
    plansForDropDownLoading: overviewState.get('plansForDropDownLoading'),
    violationStatus: violationNotification[openedOption.id],
    section,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAlternativePlansForDropdown: (section) => { dispatch(getAlternativePlansForDropdown(section)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AllPlansTab);

