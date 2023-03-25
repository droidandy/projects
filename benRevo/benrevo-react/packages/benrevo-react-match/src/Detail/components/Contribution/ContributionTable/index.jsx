import { connect } from 'react-redux';
import { saveContributions, changeContributionType, changeContribution, cancelContribution, editContribution } from '@benrevo/benrevo-react-quote';
import ContributionTable from './ContributionTable';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const overviewState = state.get('presentation').get(section);

  return {
    section,
    loading: overviewState.get('loading'),
    contributions: overviewState.get('openedOptionContributions').toJS(),
    newPlan: overviewState.get('newPlan').toJS(),
    contributionsEdit: overviewState.get('contributionsEdit').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveContributions: (section, optionId, index) => { dispatch(saveContributions(section, optionId, index)); },
    changeContributionType: (section, index, value) => { dispatch(changeContributionType(section, index, value)); },
    changeContribution: (section, index, cIndex, value, key) => { dispatch(changeContribution(section, index, cIndex, value, key)); },
    cancelContribution: (section) => { dispatch(cancelContribution(section)); },
    editContribution: (section, edit, index) => { dispatch(editContribution(section, edit, index)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContributionTable);

